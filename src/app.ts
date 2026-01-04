import express, { Request, Response } from 'express';
import usersRouter from './routes/UsersRoutes';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api/users', usersRouter);

app.use(express.json());
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log('Mon serveur run sur http://localhost:' + port);
})
