
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

    // Get routes
    app.get('api/tasks/:id', (req: Request, res: Response) => {

    });

    app.get('api/tasks', (req: Request, res: Response) => {

    });

    // Post routes
    app.post('api/tasks', (req: Request, res: Response) => {
        const description: string = req.body.description;

        // Check if description is there and not empty
        if (!description || description.length == 0) {
            const e = {
                parameterName: 'Description',
                parameterValue: description,
                errorText: 'Task description must have a value and not empty'
            };
            res.sendStatus(400).json({ e });
        } else {

        }
    });

    // Put routes

    // Delete routes


    const port = process.env.PORT || 3000;

    app.listen(port, () => {
        console.log(`Task API is listening on port ${port}`);
    })
}
