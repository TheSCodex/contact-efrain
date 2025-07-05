import express from "express";
import { connectDB } from "./db";
import contactRouter from "./routes/contact";
import userRouter from "./routes/user";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: "https://burger-express-six.vercel.app/"
}));
app.use(express.json());

app.use("/api", contactRouter, userRouter);

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});