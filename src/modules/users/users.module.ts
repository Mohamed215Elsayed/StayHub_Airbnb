import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CreateUserUseCase } from './use-cases/create-user.usecase';
import { ModelNames } from '@common/data-access';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ModelNames.USERS, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, CreateUserUseCase,UserRepository],
  exports: [UsersService,UserRepository],
})
export class UsersModule {}
