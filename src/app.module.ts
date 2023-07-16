import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { wordSentenceContent, wordSentenceSchema } from 'src/schemas/wordSentence.schema';
import { wordSentenceService } from 'src/services/wordSentence.service';
import { wordSentenceController } from 'src/controllers/wordSentence.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    MongooseModule.forFeature([{ name: wordSentenceContent.name, schema: wordSentenceSchema },])
  ],
  controllers: [
    AppController,
    wordSentenceController],
  providers: [
    AppService,
    wordSentenceService
  ],
})

export class AppModule { }
