"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const mongoose_1 = require("@nestjs/mongoose");
const wordSentence_schema_1 = require("./schemas/wordSentence.schema");
const wordSentence_service_1 = require("./services/wordSentence.service");
const wordSentence_controller_1 = require("./controllers/wordSentence.controller");
const config_1 = require("@nestjs/config");
let AppModule = exports.AppModule = class AppModule {
};
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URL),
            mongoose_1.MongooseModule.forFeature([{ name: wordSentence_schema_1.wordSentenceContent.name, schema: wordSentence_schema_1.wordSentenceSchema },])
        ],
        controllers: [
            app_controller_1.AppController,
            wordSentence_controller_1.wordSentenceController
        ],
        providers: [
            app_service_1.AppService,
            wordSentence_service_1.wordSentenceService
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map