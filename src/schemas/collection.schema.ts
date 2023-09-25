import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, now } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IsNumber, IsString } from 'class-validator';

@Schema()
export class collectionSchema {
    @Prop({ default: uuidv4 })
    collectionId: string;

    @Prop({ type: String, required: true })
    @IsString()
    title: string;

    @Prop({ type: String, required: true })
    @IsString()
    author: string;

    @Prop({ type: String, required: true })
    @IsString()
    image: string;

    @Prop({ type: String, required: true })
    @IsString()
    language: string;

    @Prop({ type: String, required: true })
    @IsString()
    difficulty: string;

    @Prop({ type: Number, required: true })
    @IsNumber()
    status: number;

    @Prop({ default: now() })
    createdAt: Date;

    @Prop({ default: now() })
    updatedAt: Date;
}

export type collectionSchemaDocument = collectionSchema & Document;

export const collectionDbSchema = SchemaFactory.createForClass(collectionSchema);
