
import { MongoClient } from "mongodb";
import { TaskDataStore } from "./datastore";
import * as Express from 'express';
import * as Morgan from 'morgan';
import * as BodyParser from 'body-parser';
import { Request, Response } from 'express';

TaskDataStore
  .connect()
  .then((client: MongoClient) => {
    const taskDataStore = new TaskDataStore(client);
    startServer(taskDataStore);
  })
  .catch(e => console.error(e));

function startServer(datastore: TaskDataStore) {
    const app = Express();

    app.use(Morgan('dev'));

    app.use(BodyParser.urlencoded({ extended: true }));
    app.use(BodyParser.json());

    const port = process.env.PORT || 3000;
}
