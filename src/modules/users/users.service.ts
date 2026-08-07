import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';
import { User, UserDocument } from './schemas/user.schema';
import { SerializedUser } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { CustomConflictException } from '@common/error-handling/custom-exceptions/conflict.exception';
import { CustomNotFoundException } from '@common/error-handling/custom-exceptions/not-found.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const existingUser: SerializedUser | null = await this.findOne(
      {
        $or: [
          { email: createUserDto.email },
          { phoneNumber: createUserDto.phoneNumber },
        ],
      },
      { lean: true },
    );

    if (existingUser) {
      if (existingUser.email === createUserDto.email) {
        throw new CustomConflictException('error.EMAIL_ALREADY_REGISTERED');
      }
      if (existingUser.phoneNumber === createUserDto.phoneNumber) {
        throw new CustomConflictException(
          'error.PHONE_NUMBER_ALREADY_REGISTERED',
        );
      }
      throw new CustomConflictException('error.USER_ALREADY_EXISTS');
    }

    const passwordHash = await argon2.hash(createUserDto.password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 1,
    });

    try {
      return await this.usersModel.create({
        name: createUserDto.name,
        email: createUserDto.email,
        phoneNumber: createUserDto.phoneNumber,
        password: passwordHash,
      });
    } catch (error: any) {
      if (error.code === 11000 && error.keyPattern) {
        const duplicatedField = Object.keys(error.keyPattern)[0];
        if (duplicatedField === 'email') {
          throw new CustomConflictException('error.EMAIL_ALREADY_REGISTERED');
        }
        if (duplicatedField === 'phoneNumber') {
          throw new CustomConflictException(
            'error.PHONE_NUMBER_ALREADY_REGISTERED',
          );
        }
        throw new CustomConflictException('error.USER_ALREADY_EXISTS');
      }
      throw error;
    }
  }

  async findOne(
    query: Record<string, unknown>,
    options: { includePassword?: boolean; lean: true },
  ): Promise<SerializedUser | null>;
  async findOne(
    query: Record<string, unknown>,
    options?: { includePassword?: boolean; lean?: boolean },
  ): Promise<UserDocument | null>;
  async findOne(
    query: Record<string, unknown>,
    options?: { includePassword?: boolean; lean?: boolean },
  ): Promise<UserDocument | SerializedUser | null> {
    let queryBuilder: any = this.usersModel.findOne(query as any);
    if (!options?.includePassword) {
      queryBuilder = queryBuilder.select('-password');
    }
    if (options?.lean) {
      queryBuilder = queryBuilder.lean();
    }
    return queryBuilder.exec();
  }

  async findOneOrFail(
    query: Record<string, unknown>,
    options: { includePassword?: boolean; lean: true },
  ): Promise<SerializedUser>;
  async findOneOrFail(
    query: Record<string, unknown>,
    options?: { includePassword?: boolean; lean?: boolean },
  ): Promise<UserDocument>;
  async findOneOrFail(
    query: Record<string, unknown>,
    options?: { includePassword?: boolean; lean?: boolean },
  ): Promise<UserDocument | SerializedUser> {
    const user = await this.findOne(query, options);
    if (!user) {
      throw new CustomNotFoundException('error.USER_NOT_FOUND');
    }
    return user;
  }
}
