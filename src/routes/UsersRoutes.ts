import { Router } from 'express';
import { users } from '../data/User';
import { User } from '../models/User';

const router = Router();

// récup tout les users
router.get('./', (req, res) => {
  res.json(users);
});

router.get('./:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((u: User) => u.id === id);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
  } else {
    res.json(user);
  }
});

//post new user
router.post('/', (req, res) => {
  const newUser: User = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

//put update de mes user
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  users[index] = {
    ...users[index],
    name: req.body.name,
    email: req.body.email
  };
  res.json(users[index]);
});

//del de mes user
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  users.splice(index, 1);
  res.status(204).send();
});

export default router;
