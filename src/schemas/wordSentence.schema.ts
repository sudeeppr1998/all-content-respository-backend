import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, now, Mixed } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export interface Language {
  text: string,
  audio: string;
}

@Schema()
export class wordSentenceContent {
  @Prop({ default: uuidv4 })
  textId: string;

  @Prop({ type: String, required: true })
  @IsString()
  publishedBy: string;

  @Prop({ type: String })
  @IsString()
  collectionId: string;

  @Prop({ type: String, required: true })
  @IsString()
  title: string;

  @Prop({ type: String, required: true })
  @IsString()
  type: string;

  @Prop({ type: String })
  @IsString()
  image: string;

  @Prop({ required: true })
  data: [Mixed];

  @Prop({ type: Number, required: true })
  @IsNumber()
  status: number;

  @Prop({ type: Number })
  @IsNumber()
  index: number;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export type wordSentenceDocument = wordSentenceContent & Document;

export const wordSentenceSchema = SchemaFactory.createForClass(wordSentenceContent);
