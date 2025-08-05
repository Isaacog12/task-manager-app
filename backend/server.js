import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Task Manager API running'));

app.get('/api/tasks', async (req, res) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
  const { title, description, priority, dueDate } = req.body;
  const task = await prisma.task.create({
    data: { title, description, priority, dueDate }
  });
  res.json(task);
});

app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, status, dueDate } = req.body;
  const updated = await prisma.task.update({
    where: { id: Number(id) },
    data: { title, description, priority, status, dueDate }
  });
  res.json(updated);
});

app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.task.delete({ where: { id: Number(id) } });
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));