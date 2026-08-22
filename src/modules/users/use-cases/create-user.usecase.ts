import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CustomConflictException } from '@common/error-handling/custom-exceptions/conflict.exception';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { hash } from '@common/utils/hash.util';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}
  async execute(body: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findOne({
      $or: [{ email: body.email }, { phoneNumber: body.phoneNumber }],
    });

    if (existingUser) {
      if (existingUser.email === body.email) {
        throw new CustomConflictException('error.EMAIL_ALREADY_REGISTERED');
      }
      if (existingUser.phoneNumber === body.phoneNumber) {
        throw new CustomConflictException(
          'error.PHONE_NUMBER_ALREADY_REGISTERED',
        );
      }
      throw new CustomConflictException('error.USER_ALREADY_EXISTS');
    }

    const passwordHash = await hash(body.password);

    try {
      const user = await this.userRepository.create({
        name: body.name,
        email: body.email,
        phoneNumber: body.phoneNumber,
        password: passwordHash,
      });
      return plainToInstance(UserResponseDto, user.toObject(), {
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
