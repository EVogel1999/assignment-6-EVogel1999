import { Collection, MongoClient, ObjectId } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();

const CONNECT_URL = process.env.MONGO_CONNECTION || '';

export class TasksDatastore {
  tasks: Collection;

  constructor(client: MongoClient) {
    this.tasks = client.db('homework').collection('tasks');
  }
  
  static async connect() {
    return new Promise<MongoClient>((resolve, reject) =>
      MongoClient.connect(CONNECT_URL, async (err: Error, client: MongoClient) => {
        if (err) {
          reject(err);
        }
        resolve(client);
      }));
  }

  async createTask(description: string) {
    const task = {
      description: description,
      isComplete: false,
      dateCreated: new Date()
    };
    try {
      await this.tasks.insertOne({ task });
    } catch (e) {
      throw e;
    }
  }
}