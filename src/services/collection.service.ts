import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { collectionSchema, collectionSchemaDocument } from "src/schemas/collection.schema";

@Injectable()
export class CollectionService {

    constructor(@InjectModel(collectionSchema.name) private collectionModel: Model<collectionSchemaDocument>) { }

    async create(collection: collectionSchema): Promise<collectionSchema> {
        try {
            const newcollection = new this.collectionModel(collection);
            const savedData = newcollection.save();
            return savedData;
        } catch (error) {
            return error;
        }
    }

    async readAll(): Promise<collectionSchema[]> {
        return await this.collectionModel.find().exec();
    }

}
