import { Injectable } from '@nestjs/common';
import { ForgetPasswordRepository } from '../repositories/forget-password.repository';
import { QueryFilter } from 'mongoose';
import { ForgetPassword } from '../schemas/forget-password.schema';

@Injectable()
export class FindForgetPasswordRawUsecase {
  constructor(
    private readonly forgetPasswordRepository: ForgetPasswordRepository,
  ) {}

  async execute(
    query: QueryFilter<ForgetPassword>,
  ): Promise<ForgetPassword | null> {
    const record = await this.forgetPasswordRepository.findOne(query);
    return record;
  }
}
