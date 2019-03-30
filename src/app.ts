
import { MongoClient } from "mongodb";
import { TaskDataStore } from "./datastore";
import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import { Request, Response } from 'express';

TaskDataStore
  .connect()
  .then((client: MongoClient) => {
    const taskDataStore = new TaskDataStore(client);
    startServer(taskDataStore);
  })
  .catch(e => console.error(e));

function startServer(datastore: TaskDataStore) {

}
