import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res } from "@nestjs/common";
import { wordSentenceContent } from "../schemas/wordSentence.schema";
import { wordSentenceService } from "../services/wordSentence.service";
import { FastifyReply } from 'fastify';


@Controller('WordSentence')
export class wordSentenceController {
    constructor(private readonly wordSentenceService: wordSentenceService) { }

    @Post()
    async create(@Res() response: FastifyReply, @Body() wordSentence: wordSentenceContent) {
        try {
            const newWordSentence = await this.wordSentenceService.create(wordSentence);
            return response.status(HttpStatus.CREATED).send({
                status: "success",
                data: newWordSentence,
            });
        } catch (error) {
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                status: "error",
                message: "Server error - " + error
            });
        }
    }

    @Post('search')
    async searchWordSentences(@Res() response: FastifyReply, @Body() tokenData: any) {
        try {
            if (tokenData.language === '' || tokenData.language === undefined) {
                tokenData.language = 'ta'
            }
            const WordSentenceCollection = await this.wordSentenceService.search(tokenData.tokenArr, tokenData.language);
            return response.status(HttpStatus.CREATED).send({
                status: "success",
                data: WordSentenceCollection,
            });
        } catch (error) {
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                status: "error",
                message: "Server error - " + error
            });
        }
    }

    @Post('charNotPresent')
    async charNotPresentWordSentences(@Res() response: FastifyReply, @Body() tokenData: any) {
        try {
            const WordSentenceCollection = await this.wordSentenceService.charNotPresent(tokenData.tokenArr);
            return response.status(HttpStatus.CREATED).send({
                status: "success",
                data: WordSentenceCollection,
            });
        } catch (error) {
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                status: "error",
                message: "Server error - " + error
            });
        }
    }

    @Get('/pagination')
    async pagination(@Res() response: FastifyReply, @Query('type') type, @Query('collectionId') collectionId, @Query('page') page = 1, @Query() { limit = 5 }) {
        try {
            const skip = (page - 1) * limit;
            const { data } = await this.wordSentenceService.pagination(skip, limit, type, collectionId);
            return response.status(HttpStatus.OK).send({ status: 'success', data });
        } catch (error) {
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                status: "error",
                message: "Server error - " + error
            });
        }
    }

    @Get()
    async fatchAll(@Res() response: FastifyReply) {
        try {
            const data = await this.wordSentenceService.readAll();
            return response.status(HttpStatus.OK).send({ status: 'success', data });
        } catch (error) {
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                status: "error",
                message: "Server error - " + error
            });
        }
    }

    @Get('/:id')
    async findById(@Res() response: FastifyReply, @Param('id') id) {
        const wordSentence = await this.wordSentenceService.readById(id);
        return response.status(HttpStatus.OK).send({
            wordSentence
        })
    }

    @Put('/:id')
    async update(@Res() response: FastifyReply, @Param('id') id, @Body() wordSentence: wordSentenceContent) {
        const updated = await this.wordSentenceService.update(id, wordSentence);
        return response.status(HttpStatus.OK).send({
            updated
        })
    }

    @Delete('/:id')
    async delete(@Res() response: FastifyReply, @Param('id') id) {
        const deleted = await this.wordSentenceService.delete(id);
        return response.status(HttpStatus.OK).send({
            deleted
        })
    }
}
