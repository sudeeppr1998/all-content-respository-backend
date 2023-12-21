import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { content, contentDocument } from "../schemas/content.schema";
import { HttpService } from "@nestjs/axios";
import { join } from "path";

@Injectable()
export class contentService {

    constructor(@InjectModel(content.name) private content: Model<contentDocument>, private readonly httpService: HttpService) { }

    async create(content: content): Promise<content> {
        try {
            const newcontent = new this.content(content);
            const savedData = newcontent.save();
            return savedData;
        } catch (error) {
            return error;
        }
    }

    async readAll(): Promise<content[]> {
        return await this.content.find().exec();
    }

    async readById(id): Promise<content> {
        return await this.content.findById(id).exec();
    }

    async update(id, content: content): Promise<content> {
        return await this.content.findByIdAndUpdate(id, content, { new: true })
    }

    async delete(id): Promise<any> {
        return await this.content.findByIdAndRemove(id);
    }

    async pagination(
        skip = 0,
        limit = 5,
        type,
        collectionId
    ) {
        const data = await this.content.find({ type: type, collectionId: collectionId }).limit(limit).skip(skip).exec();
        return {
            data: data,
            status: 200,
        }
    }

    async getRandomContent(
        limit = 5,
        type = 'Word',
        language = 'ta'
    ) {
        const data = await this.content.aggregate([
            {
                $match: {
                    'contentType': type,
                    'contentSourceData': {
                        $elemMatch: {
                            'language': language
                        }
                    }
                }
            },
            { $sample: { size: limit } }
        ]);
        return {
            data: data,
            status: 200,
        }
    }

    async getContentWord(
        limit = 5,
        language = 'ta'
    ) {
        const data = await this.content.aggregate([
            {
                $match: {
                    'contentType': 'Word',
                    'contentSourceData': {
                        $elemMatch: {
                            'language': language,
                        }
                    }
                }
            },
            { $sample: { size: limit } }
        ]);
        return {
            data: data,
            status: 200,
        }
    }

    async getContentSentence(
        limit = 5,
        language = 'ta'
    ) {
        const data = await this.content.aggregate([
            {
                $match: {
                    'contentType': 'Sentence',
                    'contentSourceData': {
                        $elemMatch: {
                            'language': language,
                        }
                    }
                }
            },
            { $sample: { size: limit } }
        ]);
        return {
            data: data,
            status: 200,
        }
    }

    async getContentParagraph(
        limit = 5,
        language = 'ta'
    ) {
        const data = await this.content.aggregate([
            {
                $match: {
                    'contentType': 'Paragraph',
                    'contentSourceData': {
                        $elemMatch: {
                            'language': language,
                        }
                    }
                }
            },
            { $sample: { size: limit } }
        ]);
        return {
            data: data,
            status: 200,
        }
    }

    async getContentLevelData(cLevel, complexityLevel, language, limit, contentType) {

        let contentLevel = [
            {
                "level": 'L1',
                "syllableCount": { "$eq": 2 },
                "language": "ta",
                "contentType": "Word"
            },
            {
                "level": 'L2',
                "syllableCount": { "$gte": 2, "$lte": 3 },
                "language": "ta",
                "contentType": "Word"
            },
            {
                "level": 'L2',
                "wordCount": { "$gte": 2, "$lte": 3 },
                "language": "ta",
                "contentType": "Sentence"
            },
            {
                "level": 'L3',
                "syllableCount": { "$gte": 3, "$lte": 4 },
                "language": "ta",
                "contentType": "Word"
            },
            {
                "level": 'L3',
                "wordCount": { "$gt": 3, "$lte": 5 },
                "language": "ta",
                "contentType": "Sentence"
            },
            {
                "level": 'L4',
                "wordCount": { "$gt": 5, "$lte": 7 },
                "language": "ta",
                "contentType": "Sentence"
            },
            {
                "level": 'L5',
                "wordCount": { "$gt": 7, "$lte": 10 },
                "language": "ta",
                "contentType": "Sentence"
            }

        ]

        let complexity = [
            {
                level: 'C1',
                totalOrthoComplexity: { "$gte": 0, "$lte": 30 },
                totalPhonicComplexity: { "$gte": 0, "$lte": 2 },
                language: "ta",
                contentType: "Word"
            },
            {
                level: 'C2',
                totalOrthoComplexity: { "$gte": 30, "$lte": 60 },
                totalPhonicComplexity: { "$gte": 0, "$lte": 8 },
                language: "ta",
                contentType: "Word"
            },
            {
                level: 'C2',
                totalOrthoComplexity: { "$gte": 0, "$lte": 100 },
                totalPhonicComplexity: { "$gte": 0, "$lte": 20 },
                meanComplexity: { "$gte": 0, "$lte": 50 },
                language: "ta",
                contentType: "Sentence"
            },
            {
                level: 'C3',
                totalOrthoComplexity: { "$gte": 60, "$lte": 100 },
                totalPhonicComplexity: { "$gte": 0, "$lte": 15 },
                language: "ta",
                contentType: "Word"
            },
            {
                level: 'C3',
                totalOrthoComplexity: { "$gte": 100, "$lte": 140 },
                totalPhonicComplexity: { "$gte": 20, "$lte": 50 },
                meanComplexity: { "$gte": 50, "$lte": 100 },
                language: "ta",
                contentType: "Sentence"
            },
            {
                level: 'C4',
                totalOrthoComplexity: { "$gt": 100 },
                totalPhonicComplexity: { "$gt": 15 },
                language: "ta",
                contentType: "Word"
            },
            {
                level: 'C4',
                totalOrthoComplexity: { "$gt": 140 },
                totalPhonicComplexity: { "$gt": 50 },
                meanComplexity: { "$gt": 100 },
                language: "ta",
                contentType: "Sentence"
            }
        ]

        let queryParam = [];

        queryParam.push(
            ...contentLevel.filter((contentLevelEle) => {
                return contentLevelEle.level === cLevel && contentLevelEle.contentType === contentType;
            })
        )

        queryParam.push(
            ...complexity.filter((complexityEle) => {
                return complexityLevel.includes(complexityEle.level) && complexityEle.contentType === contentType;
            })
        )

        let query = [];

        for (let queryParamEle of queryParam) {
            delete queryParamEle.level;
            delete queryParamEle.contentType;
            delete queryParamEle.language;
            query.push(queryParamEle);
        }



        const data = await this.content.aggregate([{
            $match: {
                "contentSourceData": {
                    $elemMatch: {
                        $or: query,
                        "language": { $eq: language }
                    }
                },
                "contentType": contentType
            }
        },
        { $sample: { size: limit } }
        ]);

        return {
            data: data,
            status: 200,
        }
    }

    async search(tokenArr, language = 'ta', contentType = 'Word', limit = 5, tags = '', cLevel, complexityLevel): Promise<any> {
        if (tokenArr.length !== 0) {

            let mileStoneQuery = [];
            let cLevelQuery: any;

            if (cLevel != '' && complexityLevel.length != 0) {
                let contentLevel = [
                    {
                        "level": 'L1',
                        "syllableCount": { "$eq": 2 },
                        "language": "ta",
                        "contentType": "Word"
                    },
                    {
                        "level": 'L2',
                        "syllableCount": { "$gte": 2, "$lte": 3 },
                        "language": "ta",
                        "contentType": "Word"
                    },
                    {
                        "level": 'L2',
                        "wordCount": { "$gte": 2, "$lte": 3 },
                        "language": "ta",
                        "contentType": "Sentence"
                    },
                    {
                        "level": 'L3',
                        "syllableCount": { "$gte": 3, "$lte": 4 },
                        "language": "ta",
                        "contentType": "Word"
                    },
                    {
                        "level": 'L3',
                        "wordCount": { "$gt": 3, "$lte": 5 },
                        "language": "ta",
                        "contentType": "Sentence"
                    },
                    {
                        "level": 'L4',
                        "wordCount": { "$gt": 5, "$lte": 7 },
                        "language": "ta",
                        "contentType": "Sentence"
                    },
                    {
                        "level": 'L5',
                        "wordCount": { "$gt": 7, "$lte": 10 },
                        "language": "ta",
                        "contentType": "Sentence"
                    }

                ]

                let complexity = [
                    {
                        level: 'C1',
                        totalOrthoComplexity: { "$gte": 0, "$lte": 30 },
                        totalPhonicComplexity: { "$gte": 0, "$lte": 2 },
                        language: "ta",
                        contentType: "Word"
                    },
                    {
                        level: 'C2',
                        totalOrthoComplexity: { "$gte": 30, "$lte": 60 },
                        totalPhonicComplexity: { "$gte": 0, "$lte": 8 },
                        language: "ta",
                        contentType: "Word"
                    },
                    {
                        level: 'C2',
                        totalOrthoComplexity: { "$gte": 0, "$lte": 100 },
                        totalPhonicComplexity: { "$gte": 0, "$lte": 20 },
                        meanComplexity: { "$gte": 0, "$lte": 50 },
                        language: "ta",
                        contentType: "Sentence"
                    },
                    {
                        level: 'C3',
                        totalOrthoComplexity: { "$gte": 60, "$lte": 100 },
                        totalPhonicComplexity: { "$gte": 0, "$lte": 15 },
                        language: "ta",
                        contentType: "Word"
                    },
                    {
                        level: 'C3',
                        totalOrthoComplexity: { "$gte": 100, "$lte": 140 },
                        totalPhonicComplexity: { "$gte": 20, "$lte": 50 },
                        meanComplexity: { "$gte": 50, "$lte": 100 },
                        language: "ta",
                        contentType: "Sentence"
                    },
                    {
                        level: 'C4',
                        totalOrthoComplexity: { "$gt": 100 },
                        totalPhonicComplexity: { "$gt": 15 },
                        language: "ta",
                        contentType: "Word"
                    },
                    {
                        level: 'C4',
                        totalOrthoComplexity: { "$gt": 140 },
                        totalPhonicComplexity: { "$gt": 50 },
                        meanComplexity: { "$gt": 100 },
                        language: "ta",
                        contentType: "Sentence"
                    }
                ]

                let contentQueryParam = [];
                let complexityQueryParam = [];

                contentQueryParam.push(
                    ...contentLevel.filter((contentLevelEle) => {
                        return contentLevelEle.level === cLevel && contentLevelEle.contentType === contentType;
                    })
                )

                complexityQueryParam.push(
                    ...complexity.filter((complexityEle) => {
                        return complexityLevel.includes(complexityEle.level) && complexityEle.contentType === contentType;
                    })
                )

                for (let contentQueryParamEle of contentQueryParam) {
                    delete contentQueryParamEle.level;
                    delete contentQueryParamEle.contentType;
                    delete contentQueryParamEle.language;
                    cLevelQuery = contentQueryParamEle;
                }

                for (let complexityQueryParamEle of complexityQueryParam) {
                    delete complexityQueryParamEle.level;
                    delete complexityQueryParamEle.contentType;
                    delete complexityQueryParamEle.language;
                    mileStoneQuery.push({ totalOrthoComplexity: complexityQueryParamEle.totalOrthoComplexity })
                    mileStoneQuery.push({ totalPhonicComplexity: complexityQueryParamEle.totalPhonicComplexity });
                }
            }

            let searchChar = tokenArr.join("|");

            let unicodeArray = [];
            for (let tokenArrEle of tokenArr) {
                let unicodeCombination = '';
                for (const [index, token] of tokenArrEle.split('').entries()) {
                    let unicodeValue = "\\" + "u0" + token.charCodeAt(0).toString(16);
                    unicodeCombination += index !== 0 ? '+' : '';
                    unicodeCombination += unicodeValue;
                }
                unicodeArray.push(unicodeCombination);
            }

            const startWithRegexPattern = new RegExp(`[${tokenArr.join("")}]`, 'gu');
            const inBetweenRegexPattern = new RegExp(`\\B(${searchChar})`, 'gu');

            let batchLimitForEndWith = Math.trunc(limit / 2);
            const batchLimitForStartWith = limit % 2 + batchLimitForEndWith;

            let wordsArr = [];
            let query: any = {};

            if (tags || tags.trim() !== '') {
                query = {
                    "contentSourceData": {
                        $elemMatch: {
                            "text": {
                                $regex: startWithRegexPattern
                            },
                            $and: [
                                cLevelQuery,
                                { $or: mileStoneQuery }
                            ]
                        }
                    },
                    "contentType": contentType,
                    "tags": { $all: tags }
                }
            } else {
                if (cLevelQuery === undefined && mileStoneQuery.length !== 0) {
                    query = {
                        "contentSourceData": {
                            "$elemMatch": {
                                "text": {
                                    $regex: startWithRegexPattern
                                },
                                $or: mileStoneQuery
                            }
                        },
                        "contentType": contentType
                    }
                } else if (mileStoneQuery.length === 0 && cLevelQuery !== undefined) {
                    query = {
                        "contentSourceData": {
                            "$elemMatch": {
                                "text": {
                                    $regex: startWithRegexPattern
                                },
                                $and: [
                                    cLevelQuery
                                ],

                            }
                        },
                        "contentType": contentType
                    }
                } else if (mileStoneQuery.length === 0 && cLevelQuery === undefined) {
                    query = {
                        "contentSourceData": {
                            "$elemMatch": {
                                "text": {
                                    $regex: startWithRegexPattern
                                }
                            }
                        },
                        "contentType": contentType
                    }
                }
                else {
                    query = {
                        "contentSourceData": {
                            "$elemMatch": {
                                "text": {
                                    $regex: startWithRegexPattern
                                },
                                $and: [
                                    cLevelQuery,
                                    { $or: mileStoneQuery }
                                ],

                            }
                        },
                        "contentType": contentType
                    }
                }
            }

            await this.content.aggregate([
                {
                    $match: query
                },
                { $sample: { size: 10000 } }
            ]).exec().then((doc) => {
                for (let docEle of doc) {
                    let regexMatchBegin = new RegExp(`^(?=(${unicodeArray.join('|')}))`, 'gu');
                    let text: string = docEle.contentSourceData[0]['text'].trim();
                    let matchRes = text.match(regexMatchBegin);
                    if (matchRes != null) {
                        let matchedChar = text.match(new RegExp(`(${unicodeArray.join('|')})`, 'gu'));
                        wordsArr.push({ ...docEle, matchedChar: matchedChar });
                        if (wordsArr.length === batchLimitForStartWith) {
                            break;
                        }
                    }
                }
            })

            batchLimitForEndWith = Math.abs(wordsArr.length - limit);

            query.contentSourceData.$elemMatch.text = inBetweenRegexPattern

            await this.content.aggregate([
                {
                    $match: query
                },
                { $sample: { size: batchLimitForEndWith } }
            ]).exec().then((doc) => {
                for (let docEle of doc) {
                    let text: string = docEle.contentSourceData[0]['text'].trim();
                    let matchedChar = text.match(new RegExp(`(${unicodeArray.join('|')})`, 'gu'));
                    wordsArr.push({ ...docEle, matchedChar: matchedChar });
                }
            })

            let contentForToken = {};
            for (let tokenArrEle of tokenArr) {
                let contentForTokenArr = [];
                for (let wordsArrEle of wordsArr) {
                    for (let matchedCharEle of wordsArrEle.matchedChar) {
                        if (matchedCharEle.match(new RegExp(`(${tokenArrEle})`, 'gu')) != null) {
                            contentForTokenArr.push(wordsArrEle);
                        }
                    }
                }
                contentForToken[tokenArrEle] = contentForTokenArr;
            }

            return { wordsArr: wordsArr, contentForToken: contentForToken };
        } else {
            return {};
        }
    }

    async charNotPresent(tokenArr): Promise<any> {
        if (tokenArr.length !== 0) {
            let searchChar = tokenArr.join("");

            const regexPattern = new RegExp(`.*${searchChar}.*`);
            let wordsArr = [];
            await this.content.find({
                $nor: [
                    { "contentSourceData.en.text": { $regex: regexPattern } },
                    { "contentSourceData.hi.text": { $regex: regexPattern } },
                    { "contentSourceData.ta.text": { $regex: regexPattern } }
                ],
                "type": "Word"
            }).limit(10).exec().then((doc => {
                let hindiVowelSignArr = ["ा", "ि", "ी", "ु", "ू", "ृ", "े", "ै", "ो", "ौ", "ं", "ः", "ँ", "ॉ", "ों", "्", "़", "़ा"];
                for (let docEle of doc) {
                    let match = false;

                    let prev = '';
                    let textArr = [];
                    for (let text of docEle.contentSourceData[0]['hi']['text'].split("")) {
                        if (hindiVowelSignArr.includes(text)) {
                            let connect = prev + text;
                            textArr.pop();
                            textArr.push(connect);
                        } else {
                            textArr.push(text);
                            prev = text;
                        }
                    }

                    for (let tokenArrEle of tokenArr) {
                        for (let textArrEle of textArr) {
                            if (tokenArrEle === textArrEle) {
                                match = true;
                                break;
                            }
                        }
                    }
                    if (match === false) {
                        wordsArr.push(docEle);
                    }
                }
            }));

            return wordsArr;

        } else {
            return [];
        }
    }
}