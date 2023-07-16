"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wordSentenceService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const wordSentence_schema_1 = require("../schemas/wordSentence.schema");
let wordSentenceService = exports.wordSentenceService = class wordSentenceService {
    constructor(wordSentenceModel) {
        this.wordSentenceModel = wordSentenceModel;
    }
    async create(wordSentence) {
        try {
            const newWordSentence = new this.wordSentenceModel(wordSentence);
            const savedData = newWordSentence.save();
            return savedData;
        }
        catch (error) {
            return error;
        }
    }
    async readAll() {
        return await this.wordSentenceModel.find().exec();
    }
    async readById(id) {
        return await this.wordSentenceModel.findById(id).exec();
    }
    async update(id, wordSentence) {
        return await this.wordSentenceModel.findByIdAndUpdate(id, wordSentence, { new: true });
    }
    async delete(id) {
        return await this.wordSentenceModel.findByIdAndRemove(id);
    }
    async pagination(skip = 0, limit = 5, type) {
        const data = await this.wordSentenceModel.find({ type: type }).limit(limit).skip(skip).exec();
        return {
            data: data,
            status: 200,
        };
    }
};
exports.wordSentenceService = wordSentenceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(wordSentence_schema_1.wordSentenceContent.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], wordSentenceService);
//# sourceMappingURL=wordSentence.service.js.map