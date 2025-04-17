import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./db.mjs";
import todoRoute from "./routes/todoRoute.mjs";
import { getTodos, createTodo, updateTodo, deleteTodo } from "./controllers/todoController.mjs";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity
  },
});

const PORT = process.env.PORT || 5000;
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("Welcome to the Todo API");
});

//localhost:5000/api/todos
app.use("/api/todos", todoRoute);

// Modify controller functions to emit events
app.post("/api/todos", async (req, res) => {
  try {
    const newTodo = await createTodo(req, res);
    if (newTodo) {
      io.emit("todoAdded", newTodo); // Emit event for new todo
    }
  } catch (error) {
    console.error(error);
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  try {
    const deletedTodo = await deleteTodo(req, res);
    if (deletedTodo) {
      io.emit("todoDeleted", req.params.id); // Emit event for deleted todo
    }
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

