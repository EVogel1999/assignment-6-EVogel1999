
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
    await this.tasks.insertOne(task);
    return await this.getTaskByData(task.description, task.isComplete, task.dateCreated);
  }

  async getTask(id: string) {
    return await this.tasks.findOne({ _id: new ObjectId(id) });
  }

  async getTaskByData(description: string, isComplete: boolean, dateCreated: Date) {
    return await this.tasks.findOne({ description: description, isComplete: isComplete, dateCreated: dateCreated });
  }

  async getTasks() {
    return await this.tasks.find({});
  }

  async updateTask(id: string, params: {description: string, isComplete: boolean}) {
    let task = await this.getTask(id);
    task.description = params.description;
    task.isComplete = params.isComplete;
    if (params.isComplete)
      task.dateCompleted = new Date();
    else
      task.dateCompleted = null;
    await this.tasks.findOneAndUpdate({ _id: new ObjectId(id) },
      { $set: {
        "description": task.description,
        "isComplete": task.isComplete,
        "dateCompleted": task.dateCompleted
      }});
  }
}
