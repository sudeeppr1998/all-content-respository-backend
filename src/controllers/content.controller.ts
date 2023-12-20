import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res } from "@nestjs/common";
import { content } from "../schemas/content.schema";
import { contentService } from "../services/content.service";
import { CollectionService } from "../services/collection.service";
import { FastifyReply } from 'fastify';
import { HttpService } from "@nestjs/axios";
import { firstValueFrom, lastValueFrom, map } from "rxjs";


@Controller('content')
export class contentController {
    constructor(private readonly contentService: contentService, private readonly collectionService: CollectionService, private readonly httpService: HttpService) { }

    @Post()
    async create(@Res() response: FastifyReply, @Body() content: any) {
        try {
            // const newContent = await this.contentService.create(wordSentence);

            const url = process.env.ALL_LC_API_URL;

            const updatedcontentSourceData = await Promise.all(content.contentSourceData.map(async (contentSourceDataEle) => {
                const textData = {
                    "request": {
                        'language_id': contentSourceDataEle['language'],
                        'text': contentSourceDataEle['text']
                    }
                };

                const newContent = await lastValueFrom(
                    this.httpService.post(url, JSON.stringify(textData), {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }).pipe(
                        map((resp) => resp.data)
                    )
                );

                let newWordMeasures = Object.entries(newContent.result.wordMeasures).map((wordMeasuresEle) => {
                    let wordComplexityMatrices: any = wordMeasuresEle[1];
                    return { text: wordMeasuresEle[0], ...wordComplexityMatrices }
                });

                delete newContent.result.meanWordComplexity;
                delete newContent.result.totalWordComplexity;
                delete newContent.result.wordComplexityMap;

                newContent.result.wordMeasures = newWordMeasures;

                return { ...contentSourceDataEle, ...newContent.result };
            }));

            content.contentSourceData = updatedcontentSourceData;

            const newContent = await this.contentService.create(content);

            return response.status(HttpStatus.CREATED).send({
                status: "success",
                data: newContent
            });
        } catch (error) {
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                status: "error",
                message: "Server error - " + error
            });
        }
    }

    @Post('search')
    async searchContent(@Res() response: FastifyReply, @Body() tokenData: any) {
        try {
            const contentCollection = await this.contentService.search(tokenData.tokenArr, tokenData.language, tokenData.contentType, tokenData.limit);
            return response.status(HttpStatus.CREATED).send({
                status: "success",
                data: contentCollection,
            });
        } catch (error) {
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                status: "error",
                message: "Server error - " + error
            });
        }
    }

    @Post('charNotPresent')
    async charNotPresentContent(@Res() response: FastifyReply, @Body() tokenData: any) {
        try {
            const contentCollection = await this.contentService.charNotPresent(tokenData.tokenArr);
            return response.status(HttpStatus.CREATED).send({
                status: "success",
                data: contentCollection,
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
            const { data } = await this.contentService.pagination(skip, limit, type, collectionId);
            return response.status(HttpStatus.OK).send({ status: 'success', data });
        } catch (error) {
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                status: "error",
                message: "Server error - " + error
            });
        }
    }

    @Get('/getRandomContent')
    async getRandomContent(@Res() response: FastifyReply, @Query('type') type, @Query('language') language, @Query() { limit = 5 }) {
        try {
            let Batch: any = limit;
            const { data } = await this.contentService.getRandomContent(parseInt(Batch), type, language);
            return response.status(HttpStatus.OK).send({ status: 'success', data });
        } catch (error) {
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                status: "error",
                message: "Server error - " + error
            });
        }
    }

    @Get('/getContentWord')
    async getContentWord(@Res() response: FastifyReply, @Query('language') language, @Query() { limit = 5 }) {
        try {
            let Batch: any = limit;
            const { data } = await this.contentService.getContentWord(parseInt(Batch), language);
            return response.status(HttpStatus.OK).send({ status: 'success', data });
        } catch (error) {

            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                status: "error",
                message: "Server error - " + error
            });
        }
    }


    @Get('/getContentSentence')
    async getContentSentence(@Res() response: FastifyReply, @Query('language') language, @Query() { limit = 5 }) {
        try {
            let Batch: any = limit;
            const { data } = await this.contentService.getContentSentence(parseInt(Batch), language);
            return response.status(HttpStatus.OK).send({ status: 'success', data });
        } catch (error) {
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                status: "error",
                message: "Server error - " + error
            });
        }
    }

    @Get('/getContentParagraph')
    async getContentParagraph(@Res() response: FastifyReply, @Query('language') language, @Query() { limit = 5 }) {
        try {
            let Batch: any = limit;
            const { data } = await this.contentService.getContentParagraph(parseInt(Batch), language);
            return response.status(HttpStatus.OK).send({ status: 'success', data });
        } catch (error) {
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                status: "error",
                message: "Server error - " + error
            });
        }
    }

    @Post('/getContent')
    async getContent(@Res() response: FastifyReply, @Body() queryData: any) {
        try {
            let Batch: any = queryData.limit || 5;
            const contentCollection = await this.contentService.search(queryData.tokenArr, queryData.language, queryData.contentType, parseInt(Batch), queryData.tags);
            return response.status(HttpStatus.CREATED).send({
                status: "success",
                data: contentCollection,
            });
        } catch (error) {
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                status: "error",
                message: "Server error - " + error
            });
        }
    }

    @Post('/getAssessment')
    async getAssessment(@Res() response: FastifyReply, @Body() queryData: any) {
        try {
            const contentCollection = await this.collectionService.getAssessment(queryData.tags, queryData.language);
            return response.status(HttpStatus.CREATED).send(contentCollection);
        } catch (error) {
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                status: "error",
                message: "Server error - " + error
            });
        }
    }

    @Post('/getContentForMileStone')
    async get(@Res() response: FastifyReply, @Body() queryData: any) {
        try {
            let Batch: any = queryData.limit || 5;
            const contentCollection = await this.contentService.getContentLevelData(queryData.cLevel, queryData.complexityLevel, queryData.language, parseInt(Batch), queryData.contentType);
            return response.status(HttpStatus.CREATED).send({
                status: "success",
                contentCollection,
            });
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
            const data = await this.contentService.readAll();
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
        const content = await this.contentService.readById(id);
        return response.status(HttpStatus.OK).send({
            content
        })
    }

    @Put('/:id')
    async update(@Res() response: FastifyReply, @Param('id') id, @Body() content: content) {
        const updated = await this.contentService.update(id, content);
        return response.status(HttpStatus.OK).send({
            updated
        })
    }

    @Delete('/:id')
    async delete(@Res() response: FastifyReply, @Param('id') id) {
        const deleted = await this.contentService.delete(id);
        return response.status(HttpStatus.OK).send({
            deleted
        })
    }
}
