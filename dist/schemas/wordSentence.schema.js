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
Object.defineProperty(exports, "__esModule", { value: true });
exports.wordSentenceSchema = exports.wordSentenceContent = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const uuid_1 = require("uuid");
const class_validator_1 = require("class-validator");
let wordSentenceContent = exports.wordSentenceContent = class wordSentenceContent {
};
__decorate([
    (0, mongoose_1.Prop)({ default: uuid_1.v4 }),
    __metadata("design:type", String)
], wordSentenceContent.prototype, "textId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], wordSentenceContent.prototype, "publishedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], wordSentenceContent.prototype, "collectionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], wordSentenceContent.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], wordSentenceContent.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], wordSentenceContent.prototype, "image", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Array)
], wordSentenceContent.prototype, "data", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], wordSentenceContent.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: (0, mongoose_2.now)() }),
    __metadata("design:type", Date)
], wordSentenceContent.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: (0, mongoose_2.now)() }),
    __metadata("design:type", Date)
], wordSentenceContent.prototype, "updatedAt", void 0);
exports.wordSentenceContent = wordSentenceContent = __decorate([
    (0, mongoose_1.Schema)()
], wordSentenceContent);
exports.wordSentenceSchema = mongoose_1.SchemaFactory.createForClass(wordSentenceContent);
//# sourceMappingURL=wordSentence.schema.js.map