import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res } from "@nestjs/common";
import { content } from "../schemas/content.schema";
import { contentService } from "../services/content.service";
import { FastifyReply } from 'fastify';
import { HttpService } from "@nestjs/axios";
import { firstValueFrom, lastValueFrom, map } from "rxjs";


@Controller('content')
export class contentController {
    constructor(private readonly contentService: contentService, private readonly httpService: HttpService) { }

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
            if (tokenData.language === '' || tokenData.language === undefined) {
                tokenData.language = 'ta'
            }
            const contentCollection = await this.contentService.search(tokenData.tokenArr, tokenData.language);
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
