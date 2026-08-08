import { Exclude, Expose, Transform } from 'class-transformer';

export class UserResponseDto {
  @Transform(({ value }) => value.toString())
  @Expose({ name: '_id' })
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  email!: string;

  @Expose()
  phoneNumber!: string;
  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  @Exclude()
  password!: string;

  @Exclude()
  __v!: number;
}
