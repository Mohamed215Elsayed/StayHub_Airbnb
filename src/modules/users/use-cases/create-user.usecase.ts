import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { User, UserDocument } from '../schemas/user.schema';
import { CustomConflictException } from '@common/error-handling/custom-exceptions/conflict.exception';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<UserDocument>,
  ) {}
  async execute(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.usersModel
      .findOne({
        $or: [
          { email: createUserDto.email },
          { phoneNumber: createUserDto.phoneNumber },
        ],
      })
      .lean()
      .exec();

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
      const user = await this.usersModel.create({
        name: createUserDto.name,
        email: createUserDto.email,
        phoneNumber: createUserDto.phoneNumber,
        password: passwordHash,
      });
      return plainToInstance(UserResponseDto, user.toJSON(), {
        excludeExtraneousValues: true,
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
}
