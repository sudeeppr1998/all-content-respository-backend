import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { wordSentenceContent, wordSentenceSchema } from 'src/schemas/wordSentence.schema';
import { collectionSchema, collectionDbSchema } from './schemas/collection.schema';
import { wordSentenceService } from 'src/services/wordSentence.service';
import { wordSentenceController } from 'src/controllers/wordSentence.controller';
import { ConfigModule } from '@nestjs/config';
import { CollectionController } from './controllers/collection.controller';
import { CollectionService } from './services/collection.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    MongooseModule.forFeature([
      { name: wordSentenceContent.name, schema: wordSentenceSchema },
      { name: collectionSchema.name, schema: collectionDbSchema }
    ])
  ],
  controllers: [
    AppController,
    wordSentenceController,
    CollectionController],
  providers: [
    AppService,
    wordSentenceService,
    CollectionService
  ],
})

export class AppModule { }
