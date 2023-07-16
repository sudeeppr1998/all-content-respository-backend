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
exports.wordSentenceController = void 0;
const common_1 = require("@nestjs/common");
const wordSentence_schema_1 = require("../schemas/wordSentence.schema");
const wordSentence_service_1 = require("../services/wordSentence.service");
let wordSentenceController = exports.wordSentenceController = class wordSentenceController {
    constructor(wordSentenceService) {
        this.wordSentenceService = wordSentenceService;
    }
    async create(response, wordSentence) {
        try {
            const newWordSentence = await this.wordSentenceService.create(wordSentence);
            return response.status(common_1.HttpStatus.CREATED).send({
                status: "success",
                data: newWordSentence,
            });
        }
        catch (error) {
            return response.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).send({
                status: "error",
                message: "Server error - " + error
            });
        }
    }
    async pagination(response, type, page = 1, { limit = 5 }) {
        try {
            const skip = (page - 1) * limit;
            const { data } = await this.wordSentenceService.pagination(skip, limit, type);
            return response.status(common_1.HttpStatus.OK).send({ status: 'success', data });
        }
        catch (error) {
            return response.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).send({
                status: "error",
                message: "Server error - " + error
            });
        }
    }
    async fatchAll(response) {
        try {
            const data = await this.wordSentenceService.readAll();
            return response.status(common_1.HttpStatus.OK).send({ status: 'success', data });
        }
        catch (error) {
            return response.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).send({
                status: "error",
                message: "Server error - " + error
            });
        }
    }
    async findById(response, id) {
        const wordSentence = await this.wordSentenceService.readById(id);
        return response.status(common_1.HttpStatus.OK).send({
            wordSentence
        });
    }
    async update(response, id, wordSentence) {
        const updated = await this.wordSentenceService.update(id, wordSentence);
        return response.status(common_1.HttpStatus.OK).send({
            updated
        });
    }
    async delete(response, id) {
        const deleted = await this.wordSentenceService.delete(id);
        return response.status(common_1.HttpStatus.OK).send({
            deleted
        });
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, wordSentence_schema_1.wordSentenceContent]),
    __metadata("design:returntype", Promise)
], wordSentenceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/pagination'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], wordSentenceController.prototype, "pagination", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], wordSentenceController.prototype, "fatchAll", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], wordSentenceController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)('/:id'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, wordSentence_schema_1.wordSentenceContent]),
    __metadata("design:returntype", Promise)
], wordSentenceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], wordSentenceController.prototype, "delete", null);
exports.wordSentenceController = wordSentenceController = __decorate([
    (0, common_1.Controller)('WordSentence'),
    __metadata("design:paramtypes", [wordSentence_service_1.wordSentenceService])
], wordSentenceController);
//# sourceMappingURL=wordSentence.controller.js.map