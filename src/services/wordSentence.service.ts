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

    async getRandomContent(
        limit = 5,
        type = 'Word',
        language = 'ta'
    ) {
        let langTextKey = language + ".audio";
        // console.log(langTextKey);
        const data = await this.wordSentenceModel.aggregate([
            {
                $match: {
                    'type': type,
                    'data': {
                        $elemMatch: {
                            [language]: { $exists: true },
                            [langTextKey]: { "$nin": [null, "", " "] }
                        }
                    }
                }
            },
            { $sample: { size: limit } }
        ]);;
        return {
            data: data,
            status: 200,
        }
    }

    async search(tokenArr, language): Promise<any> {
        if (tokenArr.length !== 0) {
            let searchChar = tokenArr.join("");
            const regexPattern = new RegExp(`[${searchChar}]`);
            let wordsArr = [];
            await this.wordSentenceModel.find({
                "data": {
                    "$elemMatch": {
                        "$or": [
                            { "en.text": { $regex: regexPattern } },
                            { "ta.text": { $regex: regexPattern } },
                            { "hi.text": { $regex: regexPattern } }
                        ]
                    }
                },
                "type": "Word"
            }).exec().then((doc) => {
                if (language === 'hi') {
                    let hindiVowelSignArr = ["ा", "ि", "ी", "ु", "ू", "ृ", "े", "ै", "ो", "ौ", "ं", "ः", "ँ", "ॉ", "ों", "्", "़", "़ा"];
                    for (let docEle of doc) {
                        let match = false;

                        let prev = '';
                        let textArr = [];
                        for (let text of docEle.data[0]['hi']['text'].split("")) {
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
                        if (match === true) {
                            wordsArr.push(docEle);
                        }
                    }
                } else if (language === 'ta') {
                    let taVowelSignArr = [
                        "ா",
                        "ி",
                        "ீ",
                        "ு",
                        "ூ",
                        "ெ",
                        "ே",
                        "ை",
                        "ொ",
                        "ோ",
                        "ௌ",
                        "்",
                    ]
                    for (let docEle of doc) {
                        let match = false;

                        let prev = '';
                        let textArr = [];
                        for (let text of docEle.data[0]['ta']['text'].split("")) {
                            if (taVowelSignArr.includes(text)) {
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
                        if (match === true) {
                            wordsArr.push(docEle);
                        }
                    }
                }
            })

            return wordsArr;
        } else {
            return [];
        }
    }

    async charNotPresent(tokenArr): Promise<any> {
        if (tokenArr.length !== 0) {
            let searchChar = tokenArr.join("");

            const regexPattern = new RegExp(`.*${searchChar}.*`);
            let wordsArr = [];
            await this.wordSentenceModel.find({
                $nor: [
                    { "data.en.text": { $regex: regexPattern } },
                    { "data.hi.text": { $regex: regexPattern } },
                    { "data.ta.text": { $regex: regexPattern } }
                ],
                "type": "Word"
            }).limit(10).exec().then((doc => {
                let hindiVowelSignArr = ["ा", "ि", "ी", "ु", "ू", "ृ", "े", "ै", "ो", "ौ", "ं", "ः", "ँ", "ॉ", "ों", "्", "़", "़ा"];
                for (let docEle of doc) {
                    let match = false;

                    let prev = '';
                    let textArr = [];
                    for (let text of docEle.data[0]['hi']['text'].split("")) {
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