import express from 'express';
import Task from '../models/task.js';


const router = express.Router();

router.get('/', async (req, res) => {
    try {
      const tasks = await Task.find();
      res.json(tasks);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  router.get('/:id', async (req, res) => {
    console.log('Request reached tasksRoutes.js');
    const { id } = req.params;
    console.log('Fetching Task with ID:', id);
    try {
      const task = await Task.findById(id);
      if (!task) {
        console.log('Task not found');
        return res.status(404).send('Task not found');
      }
      console.log('Found Task:', task);
      res.json(task);
    } catch (err) {
      console.error('Error:', err.message);
      res.status(500).send(err.message);
    }
  });


  router.post('/api/tasks', async (req, res) => {
    try {
      const task = new Task(req.body);
      await task.save();
      res.status(201).json(task);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });

  export default router;