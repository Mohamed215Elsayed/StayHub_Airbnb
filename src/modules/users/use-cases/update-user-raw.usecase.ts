import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { ClientSession, QueryFilter } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class UpdateUserRawUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    filter: QueryFilter<User>,
    update: Record<string, any>,
    session?: ClientSession,
  ): Promise<User | null> {
    return this.userRepository.findOneAndUpdate(filter, update, { session });
  }
}
