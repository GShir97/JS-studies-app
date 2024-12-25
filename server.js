import express from 'express';
import mongoose from 'mongoose';
import taskRoutes from './routes/tasksRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();

const app = express();

app.use(cors())

app.use(express.json());
app.use('/api/tasks',taskRoutes);

console.log('Server is using tasksRoutes at /api/tasks');


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

mongoose.set('debug', true);

app.listen(3000, () => {
    console.log(`Server listening on port ${3000}`);
  });