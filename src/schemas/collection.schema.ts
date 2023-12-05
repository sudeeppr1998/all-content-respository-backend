import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, now } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IsNumber, IsString } from 'class-validator';

@Schema()
export class collection {
    @Prop({ default: uuidv4 })
    collectionId: string;

    @Prop({ type: String, required: true })
    @IsString()
    name: string;

    @Prop({ type: String, required: false })
    @IsString()
    description: string;

    @Prop({ type: String, required: true })
    @IsString()
    category: string;

    @Prop({ type: String, required: false })
    @IsString()
    author: string;

    @Prop({ type: String, required: false })
    @IsString()
    publisher: string;

    @Prop({ type: String, required: false })
    @IsString()
    edition: string;

    @Prop({ type: String, required: false })
    @IsString()
    imagePath: string;

    @Prop({ type: String, required: true })
    @IsString()
    language: string;

    @Prop({ type: String, required: false })
    @IsString()
    difficultyLevel: string;

    @Prop({ type: String, required: true })
    @IsNumber()
    status: String;

    @Prop({ type: String, required: false })
    @IsString()
    ageGroup: string;

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

    @Prop({ type: String, required: false })
    @IsString()
    difficulty: string;

    @Prop({ default: now() })
    createdAt: Date;

    @Prop({ default: now() })
    updatedAt: Date;
}

export type collectionDocument = collection & Document;

export const collectionDbSchema = SchemaFactory.createForClass(collection);
