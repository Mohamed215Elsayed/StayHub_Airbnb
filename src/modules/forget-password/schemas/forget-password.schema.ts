import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class ForgetPassword {
  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  code!: string;

  @Prop({ required: true })
  expiresAt!: Date;

  @Prop({ required: true, default: false })
  isVerified!: boolean;
}

export const ForgetPasswordSchema =
  SchemaFactory.createForClass(ForgetPassword);
