import experss from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./db.mjs";
import todoRoute from "./routes/todoRoute.mjs";

const app = experss();
const PORT = process.env.PORT || 5000;
dotenv.config();

app.use(cors());
app.use(experss.json());
app.use(morgan("dev"));

app.use("/api/todos", todoRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
