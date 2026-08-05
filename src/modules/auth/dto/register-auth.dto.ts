import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsPhoneNumber,
  //   IsStrongPassword,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterAuthDto {
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
  //(trade-off)
  //   @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/, {
  //     message:
  //       'Password must contain at least 1 uppercase letter, 1 number, and 1 special character',
  //   })
  //   @IsStrongPassword(
  //     {
  //       minLength: 8,
  //       minLowercase: 0,
  //       minUppercase: 1,
  //       minNumbers: 1,
  //       minSymbols: 1,
  //     },
  //     {
  //       message:
  //         'Password must contain 1 uppercase, 1 number, and 1 special character',
  //     },
  //   )
  password!: string;

  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @IsPhoneNumber('EG', {
    message: 'Phone number must be a valid Egyptian number',
  })
  //Trade-off-I use (libphonenumber-js) to validate the phone number format, but it may not cover all possible valid formats. You can adjust the validation logic based on your specific requirements.
  //   @Matches(/^\+?[0-9]{10,15}$/, { message: 'Phone number must be valid' })
  phoneNumber!: string;
}
