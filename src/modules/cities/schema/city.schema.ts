import { ModelNames } from '@common/data-access';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class City {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, ref: ModelNames.COUNTRIES, type: Types.ObjectId })
  country!: Types.ObjectId;

  @Prop({ default: false })
  isDeleted!: boolean;

  @Prop()
  deletedAt!: Date;

  softDelete(): void {
    this.isDeleted = true;
    this.deletedAt = new Date();
  }
}
export const CitySchema = SchemaFactory.createForClass(City);
CitySchema.index({ country: 1 });
CitySchema.index({ isDeleted: 1, deletedAt: -1 });
