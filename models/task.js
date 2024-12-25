import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, default: '' },
    solution: { type: String, default: '' },
    usersCount: { type: Number, default: 0 },
  });
 
const Task = mongoose.model('Task', taskSchema); 
export default Task;