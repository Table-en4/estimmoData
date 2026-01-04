import express, { Request, Response } from 'express';
import usersRouter from './routes/UsersRoutes';
import transactionsRouter from './routes/TransactionsRoutes';
import { dataService } from './services/DataService';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/api/users', usersRouter);

app.use('/api/transactions', transactionsRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, async () => {
  console.log('Mon serveur run sur http://localhost:' + port);
  
  console.log('Chargement des données immobilières en cours...');
  try {
      await dataService.loadData();
      console.log('Données prêtes à être utilisées !');
  } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
  }
});