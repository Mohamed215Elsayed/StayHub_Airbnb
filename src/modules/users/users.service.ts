import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { CustomNotFoundException } from '@common/error-handling/custom-exceptions/not-found.exception';
import { CreateUserUseCase } from './use-cases/create-user.usecase';
import { UserRepository } from './repository/user.repository';
import { QueryFilter } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
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
