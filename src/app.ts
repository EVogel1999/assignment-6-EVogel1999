
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

function startServer(tasksDatastore: TasksDatastore) {
  const app = express();

  app.use(morgan('dev'));

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  const port = process.env.PORT || 3000;

  app.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    // Pass to next layer of middleware
    next();
  });

  // Get routes
  app.get('/api/tasks/:id', async (req: Request, res: Response) => {
    const id: string = req.params.id;
    // Validate if the task exists
    if (!id)
      res.status(400).send({
        parameterName: 'id',
        parameterValue: id,
        errorText: 'Task ID is required'
      });

    try {
      const task = await tasksDatastore.getTask(id);
      // If task was found send it back, else send 404
      if (task)
        res.status(200).send(task);
      else
        res.status(404).send({
          parameterName: "id",
          parameterValue: id,
          errorText: "No task exists with the given id"
        });
    } catch (e) {
      // If any other error occurs throw 500
      res.status(500).send(e);
    }
  });

  app.get('/api/tasks', async (req: Request, res: Response) => {
    try {
      const tasks = await tasksDatastore.getTasks();
      // If successfully got tasks, return them
      res.status(200).send(tasks);
    } catch (e) {
      // If any other error occurs throw 500
      res.status(500).send(e);
    }
  });

  // Post routes
  app.post('/api/tasks', async (req: Request, res: Response) => {
      const description: string = req.body.description;

      // Validate if description is there and not empty
      if (!description || description.length == 0) {
          res.status(400).send({
            parameterName: 'description',
            parameterValue: description,
            errorText: 'Task description must have a value and not empty'
          });
      }

      try {
        const newTask = await tasksDatastore.createTask(description);
        // Send status and location header if successfully created task
        res.setHeader('Location', port + 'api/tasks/' + newTask._id);
        res.sendStatus(201);
      } catch (e) {
        // If any other error occurs throw 500
        res.status(500).send(e);
      }
  });

  // Patch routes
  app.patch('/api/tasks/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    const description = req.body.description;
    const isComplete = req.body.isComplete;

    // Validation for the three values
    if (!id)
      res.status(400).send({
        parameterName: 'id',
        parameterValue: id,
        errorText: 'Task ID is required'
      });
    if (!description || description.length == 0)
      res.status(400).send({
        parameterName: 'description',
        parameterValue: description,
        errorText: 'Task description must have a value and not empty'
      });
    if (isComplete === undefined)
      res.status(400).send({
        parameterName: 'isComplete',
        parameterValue: isComplete,
        errorText: 'Task isComplete property is required'
      });

    try {
      await tasksDatastore.updateTask(id, {description: description, isComplete: isComplete});
      res.sendStatus(204);
    } catch (e) {
      res.status(500).send(e);
    }
  });

  app.delete('/api/tasks/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      await tasksDatastore.deleteTask(id);
      res.sendStatus(204);
    } catch (e) {
      res.status(500).send(e);
    }
  })

  app.listen(port, () => {
    console.log(`Tasks API is running on port ${port}`);
  });
}
