export class AuthResponseDto {
  user!: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    createdAt: Date;
    updatedAt: Date;
  };

  accessToken!: string;

  refreshToken!: string;
}
