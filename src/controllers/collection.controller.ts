import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res } from "@nestjs/common";
import { collection } from "src/schemas/collection.schema";
import { CollectionService } from "src/services/collection.service";
import { FastifyReply } from 'fastify';

@Controller('collection')
export class CollectionController {
    constructor(private readonly CollectionService: CollectionService) { }

    @Post()
    async create(@Res() response: FastifyReply, @Body() collection: collection) {
        try {
            const newCollection = await this.CollectionService.create(collection);
            return response.status(HttpStatus.CREATED).send({
                status: "success",
                data: newCollection,
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
            const data = await this.CollectionService.readAll();
            return response.status(HttpStatus.OK).send({ status: 'success', data });
        } catch (error) {
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                status: "error",
                message: "Server error - " + error
            });
        }
    }

    @Get('/:language')
    async fatchByLanguage(@Res() response: FastifyReply, @Param('language') language) {
        try {
            const data = await this.CollectionService.readbyLanguage(language);
            return response.status(HttpStatus.OK).send({ status: 'success', data });
        } catch (error) {
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                status: "error",
                message: "Server error - " + error
            });
        }
    }
}
