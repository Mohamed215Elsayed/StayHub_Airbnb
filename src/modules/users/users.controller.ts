import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserSwagger } from './swagger/create-user.swagger';
import { API_TAGS } from '@common/swagger';
import { Authorize } from '@modules/auth/decorators/roles.decorator';
import { Roles } from '@common/constants';

@ApiTags(API_TAGS.USERS)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @CreateUserSwagger
  @Authorize(Roles.SYSTEM_ADMIN)
  create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }
}
