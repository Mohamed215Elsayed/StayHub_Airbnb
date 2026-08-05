import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SerializedUser = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
};

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_doc: any, ret: any): SerializedUser => {
      delete ret.password;
      delete ret.__v;
      const { _id, name, email, phoneNumber, createdAt, updatedAt } = ret;
      return {
        _id: _id.toString(),
        name,
        email,
        phoneNumber,
        createdAt,
        updatedAt,
      };
    },
  },
})
export class User {
  _id!: Types.ObjectId;
  createdAt!: Date;
  updatedAt!: Date;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true, unique: true })
  phoneNumber!: string;

  @Prop({ required: true })
  password!: string;

  toAuthUser(): SerializedUser {
    return {
      _id: this._id.toString(),
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
