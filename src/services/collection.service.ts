import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { collection, collectionDocument } from "src/schemas/collection.schema";

@Injectable()
export class CollectionService {

    constructor(@InjectModel(collection.name) private collectionModel: Model<collectionDocument>) { }

    async create(collection: collection): Promise<collection> {
        try {
            const newcollection = new this.collectionModel(collection);
            const savedData = newcollection.save();
            return savedData;
        } catch (error) {
            return error;
        }
    }

    async readAll(): Promise<collection[]> {
        return await this.collectionModel.find().exec();
    }

    async readbyLanguage(language): Promise<collection[]> {
        return await this.collectionModel.find({ language: language }).exec();
    }

}
