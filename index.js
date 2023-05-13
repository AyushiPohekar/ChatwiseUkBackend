import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import requestRouter from "./routes/requestRoutes.js";

dotenv.config();

const app = express();
const port = process.env.port || 8002;

const DB = process.env.DB;
mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("MOngoDb is connected.😊"))
  .catch((err) => console.log(err));

//middlewares
app.use(express.json());
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/requests", requestRouter);

app.get("/", (req, res) => {
  res.send("You are visiting Chatwise");
});
app.listen(port, () => {
  console.log(`App started at ${port}`);
});
