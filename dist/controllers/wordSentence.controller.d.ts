import { wordSentenceContent } from "../schemas/wordSentence.schema";
import { wordSentenceService } from "../services/wordSentence.service";
import { FastifyReply } from 'fastify';
export declare class wordSentenceController {
    private readonly wordSentenceService;
    constructor(wordSentenceService: wordSentenceService);
    create(response: FastifyReply, wordSentence: wordSentenceContent): Promise<never>;
    pagination(response: FastifyReply, type: any, page: number, { limit }: {
        limit?: number;
    }): Promise<never>;
    fatchAll(response: FastifyReply): Promise<never>;
    findById(response: FastifyReply, id: any): Promise<never>;
    update(response: FastifyReply, id: any, wordSentence: wordSentenceContent): Promise<never>;
    delete(response: FastifyReply, id: any): Promise<never>;
}
