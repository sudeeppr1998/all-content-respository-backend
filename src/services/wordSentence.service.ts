import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { wordSentenceContent, wordSentenceDocument } from "../schemas/wordSentence.schema";

@Injectable()
export class wordSentenceService {

    constructor(@InjectModel(wordSentenceContent.name) private wordSentenceModel: Model<wordSentenceDocument>) { }

    async create(wordSentence: wordSentenceContent): Promise<wordSentenceContent> {
        try {
            const newWordSentence = new this.wordSentenceModel(wordSentence);
            const savedData = newWordSentence.save();
            return savedData;
        } catch (error) {
            return error;
        }
    }

    async readAll(): Promise<wordSentenceContent[]> {
        return await this.wordSentenceModel.find().exec();
    }

    async readById(id): Promise<wordSentenceContent> {
        return await this.wordSentenceModel.findById(id).exec();
    }

    async update(id, wordSentence: wordSentenceContent): Promise<wordSentenceContent> {
        return await this.wordSentenceModel.findByIdAndUpdate(id, wordSentence, { new: true })
    }

    async delete(id): Promise<any> {
        return await this.wordSentenceModel.findByIdAndRemove(id);
    }

    async pagination(
        skip = 0,
        limit = 5,
        type,
        collectionId
    ) {
        const data = await this.wordSentenceModel.find({ type: type, collectionId: collectionId }).limit(limit).skip(skip).exec();
        return {
            data: data,
            status: 200,
        }
    }

    async search(tokenArr): Promise<any> {
        if (tokenArr.length !== 0) {
            let searchChar = tokenArr.join("");

            const regexPattern = new RegExp(`[${searchChar}]`);
            return await this.wordSentenceModel.find({
                "data": {
                    "$elemMatch": {
                        "$or": [
                            { "en.text": regexPattern },
                            { "ta.text": regexPattern },
                            { "hi.text": regexPattern }
                        ]
                    }
                }
            }).limit(5).exec();
        } else {
            return [];
        }
    }

    async charNotPresent(tokenArr): Promise<any> {
        if (tokenArr.length !== 0) {
            let searchChar = tokenArr.join("");

            const regexPattern = new RegExp(`.*${searchChar}.*`)
            return await this.wordSentenceModel.find({
                $nor: [
                    { "data.en.text": { $regex: regexPattern } },
                    { "data.hi.text": { $regex: regexPattern } },
                    { "data.ta.text": { $regex: regexPattern } }
                ]
            }).limit(5).exec();
        } else {
            return [];
        }
    }
}