import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./db.mjs";
import todoRoute from "./routes/todoRoute.mjs"; // Import router instance โดยตรง

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // ควรระบุ origin ที่เฉพาะเจาะจงสำหรับ production
  },
});

const PORT = process.env.PORT || 5000;
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Todo API");
});

// --- ส่ง io instance ให้กับ Router (วิธีที่ 2) ---
// Middleware เพื่อแนบ io เข้ากับ req
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use("/api/todos", todoRoute); // ใช้ router instance ที่ import มา

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

