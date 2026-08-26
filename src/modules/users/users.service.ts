import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterAuthDto } from '@modules/auth/dto/register-auth.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { CustomNotFoundException } from '@common/error-handling/custom-exceptions/not-found.exception';
import { CreateUserUseCase } from './use-cases/create-user.usecase';
import { UserRepository } from './repository/user.repository';
import { ClientSession, QueryFilter } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { User } from './schemas/user.schema';
import { UpdateUserRawUsecase } from './use-cases/update-user-raw.usecase';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserRawUsecase: UpdateUserRawUsecase,
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
  async create(
    createUserDto: CreateUserDto | RegisterAuthDto,
  ): Promise<UserResponseDto> {
    return this.createUserUseCase.execute(createUserDto);
  }

  async updateUserRaw(
    filter: QueryFilter<User>,
    update: Record<string, any>,
    session?: ClientSession,
  ): Promise<User | null> {
    return this.updateUserRawUsecase.execute(filter, update, session);
  }

  async findOne(query: QueryFilter<User>): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findOne(query);
    if (!user) return null;
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
  async findOneOrFail(query: QueryFilter<User>): Promise<UserResponseDto> {
    const user = await this.findOne(query);
    if (!user) {
      throw new CustomNotFoundException('error.USER_NOT_FOUND');
    }
    return user;
  }
}
