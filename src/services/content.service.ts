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

    async readAll(page: number, limit: number): Promise<content[]> {
        const skip = (page - 1) * limit;
        return this.content.find().skip(skip).limit(limit).exec();
    }

    async countAll(): Promise<number> {
        return await this.content.countDocuments().exec();
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

    async search(tokenArr, language = 'ta', contentType = 'Word', limit = 5, tags = '', cLevel, complexityLevel, graphemesMappedObj, gettargetlimit = 5): Promise<any> {

        if (language !== 'en') {

            // Store All targets tokens
            let allTokensArr = tokenArr;

            // Take Top Tokens as per limit
            tokenArr = tokenArr.slice(0, gettargetlimit);

            let mileStoneQuery = [];
            let cLevelQuery: any;

            if (cLevel != '' || complexityLevel.length != 0) {
                let contentLevel = [
                    {
                        "level": 'L1',
                        "syllableCount": { "$eq": 2 },
                        "language": "ta",
                        "contentType": "Word"
                    },
                    {
                        "level": 'L1',
                        "wordCount": { "$gte": 2, "$lte": 3 },
                        "language": "ta",
                        "contentType": "Sentence"
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
                        "syllableCount": { "$lte": 8 },
                        "syllableCountArray": {
                            $not: {
                                $elemMatch: {
                                    "v": { $gte: 4 }
                                }
                            }
                        },
                        "language": "ta",
                        "contentType": "Sentence"
                    },
                    {
                        "level": 'L3',
                        "syllableCount": { "$gte": 4 },
                        "language": "ta",
                        "contentType": "Word"
                    },
                    {
                        "level": 'L3',
                        "wordCount": { "$gt": 2, "$lte": 5 },
                        "syllableCount": { "$lte": 15 },
                        "language": "ta",
                        "syllableCountArray": {
                            $not: {
                                $elemMatch: {
                                    "v": { $gte: 5 }
                                }
                            }
                        },
                        "contentType": "Sentence"
                    },
                    {
                        "level": 'L4',
                        "wordCount": { "$gt": 5, "$lte": 7 },
                        "syllableCount": { "$lte": 20 },
                        "language": "ta",
                        "syllableCountArray": {
                            $not: {
                                $elemMatch: {
                                    "v": { $gte: 7 }
                                }
                            }
                        },
                        "contentType": "Sentence"
                    },
                    {
                        "level": 'L4',
                        "wordCount": { "$lte": 10 },
                        "language": "ta",
                        "contentType": "Paragraph"
                    },
                    {
                        "level": 'L5',
                        "wordCount": { "$gte": 7, "$lte": 10 },
                        "language": "ta",
                        "contentType": "Sentence"
                    },
                    {
                        "level": 'L5',
                        "wordCount": { "$gt": 10, "$lte": 15 },
                        "language": "ta",
                        "contentType": "Paragraph"
                    },
                    {
                        "level": 'L6',
                        "wordCount": { "$gte": 7, "$lte": 12 },
                        "language": "ta",
                        "contentType": "Sentence"
                    },
                    {
                        "level": 'L6',
                        "wordCount": { "$gt": 15 },
                        "language": "ta",
                        "contentType": "Paragraph"
                    }
                ]

                let complexity = [
                    {
                        level: 'C1',
                        totalOrthoComplexity: { "$gte": 0, "$lte": 2 },
                        totalPhonicComplexity: { "$gte": 0, "$lte": 30 },
                        language: "ta",
                        contentType: "Word"
                    },
                    {
                        level: 'C1',
                        totalOrthoComplexity: { "$gte": 0, "$lte": 75 },
                        totalPhonicComplexity: { "$gte": 0, "$lte": 20 },
                        meanComplexity: { "$gte": 0, "$lte": 50 },
                        language: "ta",
                        contentType: "Sentence"
                    },
                    {
                        level: 'C2',
                        totalOrthoComplexity: { "$gte": 0, "$lte": 8 },
                        totalPhonicComplexity: { "$gte": 0, "$lte": 60 },
                        language: "ta",
                        contentType: "Word"
                    },
                    {
                        level: 'C2',
                        totalOrthoComplexity: { "$gte": 0, "$lte": 20 },
                        totalPhonicComplexity: { "$gte": 0, "$lte": 100 },
                        meanComplexity: { "$gte": 0, "$lte": 50 },
                        language: "ta",
                        contentType: "Sentence"
                    },
                    {
                        level: 'C3',
                        totalOrthoComplexity: { "$gte": 0, "$lte": 15 },
                        totalPhonicComplexity: { "$gte": 0, "$lte": 100 },
                        language: "ta",
                        contentType: "Word"
                    },
                    {
                        level: 'C3',
                        totalOrthoComplexity: { "$gte": 20, "$lte": 50 },
                        totalPhonicComplexity: { "$lte": 200 },
                        meanComplexity: { "$gte": 50, "$lte": 100 },
                        language: "ta",
                        contentType: "Sentence"
                    },
                    {
                        level: 'C4',
                        totalOrthoComplexity: { "$gt": 15 },
                        totalPhonicComplexity: { "$gt": 100 },
                        language: "ta",
                        contentType: "Word"
                    },
                    {
                        level: 'C4',
                        totalOrthoComplexity: { "$gt": 50 },
                        totalPhonicComplexity: { "$gt": 200 },
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
                    mileStoneQuery.push({ totalPhonicComplexity: complexityQueryParamEle.totalPhonicComplexity });
                    mileStoneQuery.push({ totalOrthoComplexity: complexityQueryParamEle.totalOrthoComplexity });
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

            let startWithRegexPattern = new RegExp(`[${tokenArr.join("")}]`, 'gu');
            let inBetweenRegexPattern = new RegExp(`\\B(${searchChar})`, 'gu');

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
            } else if (contentType === 'char') {
                query = {
                    "contentSourceData": {
                        $elemMatch: {
                            "text": {
                                $regex: startWithRegexPattern
                            },
                            $and: [
                                { "syllableCount": { "$eq": 2 } }
                            ]
                        }
                    },
                    "contentType": 'Word'
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

            query.contentSourceData.$elemMatch['language'] = language;

            if (tokenArr.length !== 0) {

                query.contentSourceData.$elemMatch.text = inBetweenRegexPattern

                // Check content count with top tokens with limit
                let totalContent = await this.getTotalContentAvailable(query)

                if (totalContent <= 50) {

                    console.log("After top tokens", totalContent);
                    // take targets next batch as content is below 50
                    let nextTargetLimit = gettargetlimit * 2;
                    tokenArr.push(...allTokensArr.slice(gettargetlimit, nextTargetLimit));

                    startWithRegexPattern = new RegExp(`[${tokenArr.join("")}]`, 'gu');
                    searchChar = tokenArr.join("|");
                    inBetweenRegexPattern = new RegExp(`\\B(${searchChar})`, 'gu');

                    unicodeArray = [];
                    for (let tokenArrEle of tokenArr) {
                        let unicodeCombination = '';
                        for (const [index, token] of tokenArrEle.split('').entries()) {
                            let unicodeValue = "\\" + "u0" + token.charCodeAt(0).toString(16);
                            unicodeCombination += index !== 0 ? '+' : '';
                            unicodeCombination += unicodeValue;
                        }
                        unicodeArray.push(unicodeCombination);
                    }

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
                    } else if (contentType === 'char') {
                        query = {
                            "contentSourceData": {
                                $elemMatch: {
                                    "text": {
                                        $regex: startWithRegexPattern
                                    },
                                    $and: [
                                        { "syllableCount": { "$eq": 2 } }
                                    ]
                                }
                            },
                            "contentType": 'Word'
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

                    query.contentSourceData.$elemMatch.text = inBetweenRegexPattern

                    totalContent = await this.getTotalContentAvailable(query)

                    if (totalContent <= 50) {

                        console.log("After adding next batch tokens", totalContent);
                        // Remove totalOrthoComplexity as content count is low
                        mileStoneQuery = mileStoneQuery.filter((mileStoneQueryEle) => {
                            if (mileStoneQueryEle.hasOwnProperty("totalOrthoComplexity")) {
                                return false;
                            } else {
                                return true;
                            }
                        })

                        totalContent = await this.getTotalContentAvailable(query)

                        if (totalContent <= 50) {

                            console.log("After removing totalOrthoComplexity", totalContent);
                            // Remove totalPhonicComplexity as content count is low
                            mileStoneQuery = mileStoneQuery.filter((mileStoneQueryEle) => {
                                if (mileStoneQueryEle.hasOwnProperty("totalPhonicComplexity")) {
                                    return false;
                                } else {
                                    return true;
                                }
                            })
                            totalContent = await this.getTotalContentAvailable(query)

                            if (totalContent <= 50) {
                                console.log("After removing totalPhonicComplexity", totalContent);
                                console.log(cLevelQuery);

                                if (cLevelQuery.hasOwnProperty("syllableCount")) {
                                    console.log(cLevelQuery.syllableCount)
                                    for (let syllableCountKey in cLevelQuery.wordCount) {
                                        cLevelQuery.syllableCount[syllableCountKey] = cLevelQuery.wordCount[syllableCountKey] - 1;
                                    }
                                    console.log(cLevelQuery.syllableCount);
                                }
                                if (cLevelQuery.hasOwnProperty("syllableCountArray")) {
                                    if (cLevelQuery.syllableCountArray["$not"]["$elemMatch"].v["$gte"] > 5) {
                                        cLevelQuery.syllableCountArray["$not"]["$elemMatch"].v["$gte"] = cLevelQuery.syllableCountArray["$not"]["$elemMatch"].v["$gte"] - 1;
                                    }
                                }
                            }
                        }
                    }

                }

                await this.content.aggregate([
                    {
                        $addFields: {
                            "contentSourceData": {
                                $map: {
                                    input: "$contentSourceData",
                                    as: "elem",
                                    in: {
                                        $mergeObjects: [
                                            "$$elem",
                                            {
                                                "syllableCountArray": { $objectToArray: "$$elem.syllableCountMap" }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    },
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
                        $addFields: {
                            "contentSourceData": {
                                $map: {
                                    input: "$contentSourceData",
                                    as: "elem",
                                    in: {
                                        $mergeObjects: [
                                            "$$elem",
                                            {
                                                "syllableCountArray": { $objectToArray: "$$elem.syllableCountMap" }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    },
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

            }

            if (wordsArr.length === 0) {
                delete query.contentSourceData.$elemMatch.text;
                await this.content.aggregate([
                    {
                        $addFields: {
                            "contentSourceData": {
                                $map: {
                                    input: "$contentSourceData",
                                    as: "elem",
                                    in: {
                                        $mergeObjects: [
                                            "$$elem",
                                            {
                                                "syllableCountArray": { $objectToArray: "$$elem.syllableCountMap" }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    {
                        $match: query
                    },
                    { $sample: { size: limit } }
                ]).exec().then((doc) => {
                    for (let docEle of doc) {
                        wordsArr.push({ ...docEle, matchedChar: [] });
                    }
                })
            }

            let contentForToken = {};

            if (wordsArr.length > 0) {

                let textSet = new Set();

                for (let wordsArrEle of wordsArr) {
                    for (let contentSourceDataEle of wordsArrEle.contentSourceData) {
                        if (contentSourceDataEle.language === language) {
                            textSet.add(contentSourceDataEle.text.trim());
                        }
                    }
                }

                if (textSet.size !== limit) {

                    for (let textSetEle of textSet) {
                        let repeatCounter = 0;
                        let deleteFlag = false;
                        for (let [wordArrEleIndex, wordsArrEle] of wordsArr.entries()) {

                            if (wordsArrEle !== undefined) {
                                for (let contentSourceDataEle of wordsArrEle["contentSourceData"]) {
                                    if (contentSourceDataEle.language === language) {
                                        if (contentSourceDataEle.text.trim() === textSetEle) {
                                            if (repeatCounter === 1) {
                                                deleteFlag = true;
                                                break;
                                            } else {
                                                repeatCounter++;
                                            }
                                        }
                                    }
                                }

                                if (deleteFlag === true) {

                                    delete wordsArr[wordArrEleIndex];
                                }
                            }

                        }
                    }
                }

                wordsArr = wordsArr.filter(element => {
                    return element !== undefined;
                });


                if (wordsArr.length !== limit) {
                    let fetchlimit = limit - wordsArr.length

                    if (contentType !== 'char') {
                        await this.content.aggregate([
                            {
                                $addFields: {
                                    "contentSourceData": {
                                        $map: {
                                            input: "$contentSourceData",
                                            as: "elem",
                                            in: {
                                                $mergeObjects: [
                                                    "$$elem",
                                                    {
                                                        "syllableCountArray": { $objectToArray: "$$elem.syllableCountMap" }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                $match: query
                            },
                            { $sample: { size: fetchlimit } }
                        ]).exec().then((doc) => {
                            for (let docEle of doc) {
                                let text: string = docEle.contentSourceData[0]['text'].trim();
                                let matchedChar = text.match(new RegExp(`(${unicodeArray.join('|')})`, 'gu'));
                                wordsArr.push({ ...docEle, matchedChar: matchedChar });
                            }
                        })
                    }
                }

                for (let tokenArrEle of tokenArr) {
                    let contentForTokenArr = [];
                    for (let wordsArrEle of wordsArr) {
                        if (wordsArrEle)
                            for (let matchedCharEle of wordsArrEle.matchedChar) {
                                if (matchedCharEle.match(new RegExp(`(${tokenArrEle})`, 'gu')) != null) {
                                    contentForTokenArr.push(wordsArrEle);
                                }
                            }
                    }

                    if (contentForTokenArr.length === 0 && contentType !== 'char') {
                        query.contentSourceData.$elemMatch.text = new RegExp(`(${tokenArrEle})`, 'gu')
                        await this.content.aggregate([
                            {
                                $addFields: {
                                    "contentSourceData": {
                                        $map: {
                                            input: "$contentSourceData",
                                            as: "elem",
                                            in: {
                                                $mergeObjects: [
                                                    "$$elem",
                                                    {
                                                        "syllableCountArray": { $objectToArray: "$$elem.syllableCountMap" }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                $match: query
                            },
                            { $sample: { size: 2 } }
                        ]).exec().then((doc) => {
                            for (let docEle of doc) {
                                let text: string = docEle.contentSourceData[0]['text'].trim();
                                let matchedChar = text.match(new RegExp(`(${unicodeArray.join('|')})`, 'gu'));
                                contentForTokenArr.push({ ...docEle, matchedChar: matchedChar });
                            }
                        })
                        contentForToken[tokenArrEle] = contentForTokenArr;
                    } else {
                        contentForToken[tokenArrEle] = contentForTokenArr;
                    }
                }
            }

            return { wordsArr: wordsArr, contentForToken: contentForToken };
        } else if (language === "en") {
            let wordsArr = [];
            let cLevelQuery: any;

            // Store All targets tokens
            let allTokensArr = tokenArr;

            // Take Top Tokens as per limit
            tokenArr = tokenArr.slice(0, gettargetlimit);

            if (contentType.toLocaleLowerCase() === 'char') {
                contentType = 'Word'
            }

            if (cLevel != '') {
                let contentLevel = [
                    {
                        "level": 'L1',
                        "syllableCount": { "$gte": 2, "$lte": 3 },
                        "language": "ta",
                        "contentType": "Word"
                    },
                    {
                        "level": 'L1',
                        "wordCount": { "$gte": 2, "$lte": 3 },
                        "language": "ta",
                        "contentType": "Sentence"
                    },
                    {
                        "level": 'L2',
                        "syllableCount": { "$eq": 4 },
                        "language": "ta",
                        "contentType": "Word"
                    },
                    {
                        "level": 'L2',
                        "wordCount": { "$gte": 2, "$lte": 3 },
                        "syllableCount": { "$lte": 8 },
                        "syllableCountArray": {
                            $not: {
                                $elemMatch: {
                                    "v": { $gte: 4 }
                                }
                            }
                        },
                        "language": "ta",
                        "contentType": "Sentence"
                    },
                    {
                        "level": 'L3',
                        "syllableCount": { "$gt": 4 },
                        "language": "ta",
                        "contentType": "Word"
                    },
                    {
                        "level": 'L3',
                        "wordCount": { "$gt": 2, "$lte": 5 },
                        "syllableCount": { "$lte": 15 },
                        "language": "ta",
                        "syllableCountArray": {
                            $not: {
                                $elemMatch: {
                                    "v": { $gte: 5 }
                                }
                            }
                        },
                        "contentType": "Sentence"
                    },
                    {
                        "level": 'L4',
                        "wordCount": { "$gt": 5, "$lte": 7 },
                        "syllableCount": { "$lte": 20 },
                        "language": "ta",
                        "syllableCountArray": {
                            $not: {
                                $elemMatch: {
                                    "v": { $gte: 7 }
                                }
                            }
                        },
                        "contentType": "Sentence"
                    },
                    {
                        "level": 'L4',
                        "wordCount": { "$lte": 10 },
                        "language": "ta",
                        "contentType": "Paragraph"
                    },
                    {
                        "level": 'L5',
                        "wordCount": { "$gte": 7, "$lte": 10 },
                        "language": "ta",
                        "contentType": "Sentence"
                    },
                    {
                        "level": 'L5',
                        "wordCount": { "$gt": 10, "$lte": 15 },
                        "language": "ta",
                        "contentType": "Paragraph"
                    },
                    {
                        "level": 'L6',
                        "wordCount": { "$gte": 7, "$lte": 12 },
                        "language": "ta",
                        "contentType": "Sentence"
                    },
                    {
                        "level": 'L6',
                        "wordCount": { "$gt": 15 },
                        "language": "ta",
                        "contentType": "Paragraph"
                    }
                ]

                let contentQueryParam = [];

                contentQueryParam.push(
                    ...contentLevel.filter((contentLevelEle) => {
                        return contentLevelEle.level === cLevel && contentLevelEle.contentType === contentType;
                    })
                )

                for (let contentQueryParamEle of contentQueryParam) {
                    delete contentQueryParamEle.level;
                    delete contentQueryParamEle.contentType;
                    delete contentQueryParamEle.language;
                    cLevelQuery = contentQueryParamEle;
                }
            }

            let query = {
                "contentSourceData": {
                    "$elemMatch": {
                        "phonemes": { "$in": tokenArr },
                        $and: [cLevelQuery]
                    }
                },
                "contentType": contentType
            }

            query.contentSourceData.$elemMatch['language'] = language;

            let totalContent = await this.getTotalContentAvailable(query);

            if (totalContent <= 50) {
                console.log("After top tokens", totalContent);
                // take targets next batch as content is below 50
                let nextTargetLimit = gettargetlimit * 2;
                tokenArr.push(...allTokensArr.slice(gettargetlimit, nextTargetLimit));

                totalContent = await this.getTotalContentAvailable(query);

                console.log("After adding tokens", totalContent);

                if (totalContent <= 50) {

                    console.log("After adding more targets", totalContent);

                    if (cLevelQuery.hasOwnProperty("syllableCount")) {
                        console.log(cLevelQuery.syllableCount)
                        for (let syllableCountKey in cLevelQuery.wordCount) {
                            cLevelQuery.syllableCount[syllableCountKey] = cLevelQuery.wordCount[syllableCountKey] - 1;
                        }
                        console.log(cLevelQuery.syllableCount);
                    }
                    if (cLevelQuery.hasOwnProperty("syllableCountArray")) {
                        if (cLevelQuery.syllableCountArray["$not"]["$elemMatch"].v["$gte"] > 5) {
                            cLevelQuery.syllableCountArray["$not"]["$elemMatch"].v["$gte"] = cLevelQuery.syllableCountArray["$not"]["$elemMatch"].v["$gte"] - 1;
                        }
                    }
                }
            }


            let allTokenGraphemes = [];

            await this.content.aggregate([
                {
                    $addFields: {
                        "contentSourceData": {
                            $map: {
                                input: "$contentSourceData",
                                as: "elem",
                                in: {
                                    $mergeObjects: [
                                        "$$elem",
                                        {
                                            "syllableCountArray": { $objectToArray: "$$elem.syllableCountMap" }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $match: query
                },
                { $sample: { size: limit } }
            ]).exec().then((doc) => {
                for (let docEle of doc) {
                    let matchedGraphemes = [];
                    const matchedTokens = tokenArr.filter(token => docEle.contentSourceData[0].phonemes.includes(token));
                    for (let matchedTokensEle of matchedTokens) {
                        matchedGraphemes.push(...graphemesMappedObj[matchedTokensEle]);
                        allTokenGraphemes.push(...graphemesMappedObj[matchedTokensEle]);
                    }
                    wordsArr.push({ ...docEle, matchedChar: matchedGraphemes });
                }
            })

            if (wordsArr.length === 0) {
                delete query.contentSourceData.$elemMatch.phonemes;

                await this.content.aggregate([
                    {
                        $addFields: {
                            "contentSourceData": {
                                $map: {
                                    input: "$contentSourceData",
                                    as: "elem",
                                    in: {
                                        $mergeObjects: [
                                            "$$elem",
                                            {
                                                "syllableCountArray": { $objectToArray: "$$elem.syllableCountMap" }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    {
                        $match: query
                    },
                    { $sample: { size: limit } }
                ]).exec().then((doc) => {
                    for (let docEle of doc) {
                        wordsArr.push({ ...docEle, matchedChar: [] });
                    }
                })
            }

            let contentForToken = {};

            for (let allTokenGraphemesEle of allTokenGraphemes) {
                let contentForTokenArr = [];
                for (let wordsArrEle of wordsArr) {
                    if (wordsArrEle)
                        if (wordsArrEle.matchedChar.includes(allTokenGraphemesEle)) {
                            contentForTokenArr.push(wordsArrEle);
                        }
                }

                contentForToken[allTokenGraphemesEle] = contentForTokenArr;
            }

            return { wordsArr: wordsArr, contentForToken: contentForToken };
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

    async getTotalContentAvailable(query): Promise<any> {

        let totalData = await this.content.aggregate([
            {
                $addFields: {
                    "contentSourceData": {
                        $map: {
                            input: "$contentSourceData",
                            as: "elem",
                            in: {
                                $mergeObjects: [
                                    "$$elem",
                                    {
                                        "syllableCountArray": { $objectToArray: "$$elem.syllableCountMap" }
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $match: query
            },
            {
                $count: "totalContent"
            }
        ]).exec();
        return totalData[0]?.totalContent || 0;
    }

}