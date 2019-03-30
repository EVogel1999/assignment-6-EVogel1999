
import { Collection, MongoClient, ObjectId } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();

const MONGO_CONNECT = process.env.MONGO_CONNECT || '';

export class TaskDataStore {
    tasks: Collection;

    constructor(client: MongoClient) {
        this.tasks = client.db().collection('tasks');
    }

    static async connect() {
        return new Promise<MongoClient>((resolve, reject) =>
          MongoClient.connect(MONGO_CONNECT,
            async (e: Error, client: MongoClient) => {
                if (e)
                    reject(e);
                resolve(client);
        }));
    }

}
