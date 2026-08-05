import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { CustomConflictException } from '@common/error-handling/custom-exceptions/conflict.exception';

/**
 * Service handling user-related business logic.
 * All password hashing uses Argon2id with OWASP-recommended parameters.
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<UserDocument>,
  ) {}

  /**
   * Creates a new user account.
   *
   * @param createUserDto - DTO containing name, email, phoneNumber, and plain password.
   * @returns The created UserDocument (password field stripped automatically via schema transform).
   * @throws ConflictException if the email or phone number is already registered.
   */
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    // 1. Check for duplicate email and phone number to avoid wasting CPU on hashing.
    const existingUser: UserDocument | null = await this.usersModel.findOne({
      // Check for existing user with the same email OR phone number.
      // Using MongoDB's $or operator to perform a single query that
      // matches either field. This reduces database round-trips and
      // allows us to provide a specific error message for the conflict.
      //
      // NOTE: This pre-check reduces the race‑condition window, but it does
      // NOT fully eliminate it – two concurrent requests with the same email
      // could both pass this check before either saves. The ultimate safeguard
      // against duplicates is the unique index defined in the User schema,
      // which enforces uniqueness at the database level.
      $or: [
        { email: createUserDto.email },
        { phoneNumber: createUserDto.phoneNumber },
      ],
    });

    if (existingUser) {
      // Determine which field caused the conflict for a clear error message.
      if (existingUser.email === createUserDto.email) {
        throw new CustomConflictException('Email is already registered');
      }
      if (existingUser.phoneNumber === createUserDto.phoneNumber) {
        throw new CustomConflictException('Phone number is already registered');
      }
      // Fallback (should not happen).
      throw new CustomConflictException('User already exists');
    }

    // 2. Hash the password using Argon2id.
    //    - memoryCost: 65536 KiB (64 MiB) – OWASP minimum recommendation.
    //    - timeCost: 3 iterations – balances speed vs. security.
    //    - parallelism: 1 – typical for server environments.
    const passwordHash = await argon2.hash(createUserDto.password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 1,
    });

    // 3. Store the user with the hashed password.
    return this.usersModel.create({
      name: createUserDto.name,
      email: createUserDto.email,
      phoneNumber: createUserDto.phoneNumber,
      password: passwordHash,
    });
  }
}
