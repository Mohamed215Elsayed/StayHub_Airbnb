import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'countries',
})
export class Country {
  _id!: Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  })
  name!: string;

  @Prop({
    unique: true,
    sparse: true,
    uppercase: true,
    match: /^[A-Z]{2,3}$/, // ISO code (2 or 3 letters)
  })
  countryCode?: string;

  @Prop({ default: false })
  isDeleted!: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date | null;

  softDelete(): void {
    this.isDeleted = true;
    this.deletedAt = new Date();
  }
}
export type CountryDocument = Country & Document;
export const CountrySchema = SchemaFactory.createForClass(Country);

CountrySchema.index({ isDeleted: 1, deletedAt: 1 });
