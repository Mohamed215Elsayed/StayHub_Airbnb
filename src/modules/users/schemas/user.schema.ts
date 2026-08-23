import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User {
  _id!: Types.ObjectId;
  createdAt!: Date;
  updatedAt!: Date;

  get id(): string {
    return this._id.toString();
  }

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true, unique: true })
  phoneNumber!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ default: false })
  isDeleted!: boolean;

  @Prop()
  deletedAt!: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
