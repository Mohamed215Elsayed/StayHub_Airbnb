import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsPhoneNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100)
  name!: string;

  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(64)
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least 1 uppercase letter',
  })
  @Matches(/(?=.*\d)/, {
    message: 'Password must contain at least 1 number',
  })
  @Matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message: 'Password must contain at least 1 special character',
  })
  password!: string;

  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @IsPhoneNumber('EG', {
    message: 'Phone number must be a valid Egyptian number',
  })
  phoneNumber!: string;
}
