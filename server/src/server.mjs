import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./db.mjs";
import todoRoute from "./routes/todoRoute.mjs";

const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.get("/", (req, res) => {
  res.send("Welcome to the Todo API");
});

//localhost:5000/api/todos
app.use("/api/todos", todoRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
