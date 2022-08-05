import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SeriesDocument = Series & Document;

@Schema()
export class Series {
  @Prop({
    required: true,
    unique: true,
  })
  name: string;
}

export const SeriesSchema = SchemaFactory.createForClass(Series);
