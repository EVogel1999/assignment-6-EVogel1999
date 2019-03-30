import { MongoClient } from "mongodb";
import { TasksDatastore } from "./datastore";
import * as express from 'express';
import * as morgan from 'morgan';
import { Request, Response } from 'express';

const bodyParser = require('body-parser');

TasksDatastore
  .connect()
  .then((client: MongoClient) => {
    const ordersDatastore = new TasksDatastore(client);
    startServer(ordersDatastore);
  })
  .catch(e => console.error(e));

function startServer(ordersDatastore: TasksDatastore) {
  const app = express();

  app.use(morgan('dev'));

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  const port = process.env.PORT || 3000;

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

  // Patch routes
  app.patch('api/tasks/:id', (req: Request, res: Response) => {

  });

  app.listen(port, () => {
    console.log(`Tasks API is running on port ${port}`);
  });
}