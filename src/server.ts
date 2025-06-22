import express from "express";
import { connectDB } from "./db";
import router from "./routes/contact";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use("/api", router);

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});