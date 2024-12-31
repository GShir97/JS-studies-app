import express from 'express';
import http from "http";
import { Server } from "socket.io";
import mongoose from 'mongoose';
import taskRoutes from './routes/tasksRoutes.js';
import Task from "./models/task.js";
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(express.json());
app.use('/api/tasks', taskRoutes);

const connectedUsers = {};

io.on("connection", (socket) => {
  console.log("WebSocket connection established with ID:", socket.id);

  socket.on("joinTask", async ({ taskId }) => {
    try {
      const task = await Task.findById(taskId);
      console.log(`socket ${socket.id}`);
      if (task) {
        socket.join(taskId);
        const usersInRoom = io.sockets.adapter.rooms.get(taskId);
        const isMentorInRoom = usersInRoom && Array.from(usersInRoom).some(id => connectedUsers[id] === 'mentor');

        if (!isMentorInRoom) {
          connectedUsers[socket.id] = "mentor";
          io.to(socket.id).emit("role", "mentor");
        } else {
          connectedUsers[socket.id] = "student";
          io.to(socket.id).emit("role", "student");
        }

        updateViewersCount(taskId);
      }
    } catch (error) {
      console.error("Error joining task:", error.message);
    }
  });

  socket.on("updateCode", async ({ id, code }) => {
    try {
      await Task.findByIdAndUpdate(id, { code });
      io.to(id).emit("codeUpdated", code);
    } catch (error) {
      console.error("Error updating code:", error.message);
    }
  });

  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.id);
    const taskId = Array.from(socket.rooms).find(roomId => roomId !== socket.id);

    if (taskId) {
      const usersInRoom = io.sockets.adapter.rooms.get(taskId);
      const wasMentor = connectedUsers[socket.id] === 'mentor';

      if (wasMentor && usersInRoom) {
        const newMentor = Array.from(usersInRoom)[0]; 
        connectedUsers[newMentor] = 'mentor';
        io.to(newMentor).emit('role', 'mentor');
      }

      delete connectedUsers[socket.id];
      updateViewersCount(taskId);
    }
  });
});

const updateViewersCount = (taskId) => {
  const usersInRoom = io.sockets.adapter.rooms.get(taskId);
  const viewersCount = usersInRoom
    ? Array.from(usersInRoom).filter(id => connectedUsers[id] === 'student').length
    : 0;

  io.to(taskId).emit("updateViewers", viewersCount);
};

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

mongoose.set('debug', true);

server.listen(3000, () => {
  console.log(`Server listening on port ${3000}`);
});