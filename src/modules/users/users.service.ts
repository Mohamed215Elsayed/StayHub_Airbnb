import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';
import { User, UserDocument } from './schemas/user.schema';
import { SerializedUser } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { CustomConflictException } from '@common/error-handling/custom-exceptions/conflict.exception';
import { CustomNotFoundException } from '@common/error-handling/custom-exceptions/not-found.exception';

/**
 * Service handling user-related business logic.
 *
 * All password hashing uses Argon2id with OWASP-recommended parameters:
 * - memoryCost: 64 MiB
 * - timeCost: 3 iterations
 * - parallelism: 1 thread
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<UserDocument>,
  ) {}

  /**
   * Creates a new user account.
   *
   * Performs a preliminary duplicate check to avoid unnecessary CPU-intensive
   * password hashing, then hashes the password with Argon2id and stores the user.
   *
   * @param createUserDto - DTO containing name, email, phoneNumber, and plain password.
   * @returns The created `UserDocument` (password is stripped via schema `toJSON` transform).
   * @throws CustomConflictException if the email or phone number is already registered.
   *
   * @remarks
   * The preliminary check reduces the race-condition window but does NOT eliminate it
   * entirely. Two concurrent requests with the same email could both pass the check
   * before either saves. The MongoDB unique index is the final safeguard.
   * A duplicate key error (code 11000) is caught and translated into a user-friendly
   * conflict exception with a specific message for the offending field.
   */
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
        throw new CustomConflictException('Email is already registered');
      }
      if (existingUser.phoneNumber === createUserDto.phoneNumber) {
        throw new CustomConflictException('Phone number is already registered');
      }
      throw new CustomConflictException('User already exists');
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
          throw new CustomConflictException('Email is already registered');
        }
        if (duplicatedField === 'phoneNumber') {
          throw new CustomConflictException('Phone number is already registered');
        }
        throw new CustomConflictException('User already exists');
      }
      throw error;
    }
  }

  /**
   * Finds a single user by a MongoDB query filter.
   *
   * @param query - MongoDB filter object (e.g. `{ email: "user@example.com" }`).
   * @param options - Optional settings:
   *   - `includePassword`: if `true`, the password hash is included in the result (default: `false`).
   *   - `lean`: if `true`, returns a plain JavaScript object (`SerializedUser`) instead of a full Mongoose document.
   * @returns The matching user, or `null` if no user is found.
   *
   * @remarks
   * Uses method overloads so TypeScript can infer the correct return type:
   * - With `lean: true` → `SerializedUser | null` (plain object, no Mongoose methods)
   * - Without `lean` → `UserDocument | null` (full Mongoose document with methods)
   */
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

  /**
   * Finds a single user or throws a `CustomNotFoundException`.
   *
   * Useful in controllers or services where the existence of the user is mandatory
   * (e.g., profile updates, deletion, token operations).
   *
   * @param query - MongoDB filter object.
   * @param options - Same options as `findOne`.
   * @returns The matching user document (never `null`).
   * @throws CustomNotFoundException if no user matches the query.
   */
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
      throw new CustomNotFoundException('User not found');
    }
    return user;
  }
}
