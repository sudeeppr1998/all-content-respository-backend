import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, now, Mixed } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

// export interface Language {
//   text: string,
//   audio: string;
// }

@Schema()
export class content {
  @Prop({ default: uuidv4 })
  contentId: string;

  @Prop({ type: String, required: false })
  @IsString()
  collectionId: string;

  @Prop({ type: String, required: true })
  @IsString()
  name: string;

  @Prop({ type: String, required: true })
  @IsString()
  contentType: string;

  @Prop({ type: String, required: false })
  @IsString()
  imagePath: string;

  @Prop({ required: true })
  contentSourceData: [Mixed];

  @Prop({ type: String, required: false })
  @IsString()
  flaggedBy: string;

  @Prop({ type: String, required: false })
  @IsString()
  lastFlaggedOn: string;

  @Prop({ type: String, required: false })
  @IsString()
  flagReasons: string;

  @Prop({ type: String, required: false })
  @IsString()
  reviewer: string;

  @Prop({ type: String, required: false })
  @IsString()
  reviewStatus: string;

  @Prop({ type: String, required: true })
  @IsString()
  status: string;

  @Prop({ type: String, required: false })
  @IsString()
  publisher: string;

  @Prop({ type: String, required: false })
  @IsString()
  language: string;

  @Prop({ type: Number, required: false })
  @IsNumber()
  contentIndex: number;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export type contentDocument = content & Document;

export const contentSchema = SchemaFactory.createForClass(content);
