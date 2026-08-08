import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { CustomNotFoundException } from '@common/error-handling/custom-exceptions/not-found.exception';
import { CreateUserUseCase } from './use-cases/create-user.usecase';

/**
 * Service handling user-related read operations (findOne, findOneOrFail)
 * and delegating user creation to {@link CreateUserUseCase}.
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<UserDocument>,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  /**
   * Creates a new user.
   *
   * Delegates to {@link CreateUserUseCase} which handles:
   * - Duplicate email / phone validation
   * - Argon2id password hashing
   * - MongoDB document creation
   * - Serialization to {@link UserResponseDto} (passwords excluded)
   *
   * @param createUserDto - The user data transfer object containing
   *                        name, email, password, and phoneNumber.
   * @returns The created user serialized as {@link UserResponseDto}.
   * @throws CustomConflictException if email or phone already exists.
   */
  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.createUserUseCase.execute(createUserDto);
  }

  /**
   * Finds a single user matching the given query.
   *
   * By default the `password` field is excluded from the result.
   * Pass `{ includePassword: true }` if you need the raw document (e.g. for
   * password verification during login).
   *
   * When `lean: true` is passed, Mongoose returns a plain JavaScript
   * object instead of a full Mongoose document. This is useful for
   * read-only operations where Mongoose getters/hooks aren't needed.
   *
   * @example
   * // Find by email — excludes password, returns Mongoose document
   * const user = await usersService.findOne({ email: 'user@example.com' });
   *
   * @example
   * // Find by email — includes password, returns lean object
   * const user = await usersService.findOne(
   *   { email: 'user@example.com' },
   *   { includePassword: true, lean: true },
   * );
   *
   * @param query  - A Mongoose-compatible query filter.
   * @param options - `includePassword` keeps the hashed password field.
   *                  `lean` returns a plain object instead of a document.
   */
  async findOne(
    query: Record<string, unknown>,
    options: { includePassword?: boolean; lean: true },
  ): Promise<{
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    createdAt: Date;
    updatedAt: Date;
  } | null>;

  /**
   * Finds a single user matching the given query (document variant).
   *
   * Returns a full Mongoose document (without the `password` field) when
   * `lean` is omitted or falsy.
   *
   * @param query  - A Mongoose-compatible query filter.
   * @param options - `includePassword` keeps the hashed password field.
   */
  async findOne(
    query: Record<string, unknown>,
    options?: { includePassword?: boolean; lean?: boolean },
  ): Promise<UserDocument | null>;

  /**
   * Implementation of the overloaded `findOne` method.
   *
   * Builds a Mongoose query with optional `password` exclusion and
   * optional `.lean()` transformation.
   *
   * @param query  - A Mongoose-compatible query filter.
   * @param options - `includePassword` and/or `lean` flags.
   * @returns A Mongoose document (default) or a lean serialized object.
   */
  async findOne(
    query: Record<string, unknown>,
    options?: { includePassword?: boolean; lean?: boolean },
  ): Promise<
    | UserDocument
    | {
        _id: string;
        name: string;
        email: string;
        phoneNumber: string;
        createdAt: Date;
        updatedAt: Date;
      }
    | null
  > {
    let queryBuilder: any = this.usersModel.findOne(query);
    if (!options?.includePassword) {
      queryBuilder = queryBuilder.select('-password');
    }
    if (options?.lean) {
      queryBuilder = queryBuilder.lean();
    }
    return queryBuilder.exec();
  }

  /**
   * Finds a single user or throws if not found.
   *
   * Behaves identically to {@link findOne} overloads, but throws
   * {@link CustomNotFoundException} instead of returning `null` when
   * no document matches the query.
   *
   * @param query  - A Mongoose-compatible query filter.
   * @param options - `includePassword` and/or `lean` flags.
   * @returns A Mongoose document or lean serialized object.
   * @throws CustomNotFoundException (localized) if the user is not found.
   */
  async findOneOrFail(
    query: Record<string, unknown>,
    options: { includePassword?: boolean; lean: true },
  ): Promise<{
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  async findOneOrFail(
    query: Record<string, unknown>,
    options?: { includePassword?: boolean; lean?: boolean },
  ): Promise<UserDocument>;

  /** Implementation — delegates to {@link findOne} and throws if null. */
  async findOneOrFail(
    query: Record<string, unknown>,
    options?: { includePassword?: boolean; lean?: boolean },
  ): Promise<
    | UserDocument
    | {
        _id: string;
        name: string;
        email: string;
        phoneNumber: string;
        createdAt: Date;
        updatedAt: Date;
      }
  > {
    const user = await this.findOne(query, options);
    if (!user) {
      throw new CustomNotFoundException('error.USER_NOT_FOUND');
    }
    return user;
  }
}
