import { Router } from "express";
import {
  createUser,
  loginUser,
  getUserById,
  deleteUser,
} from "../controllers/user";
import { apiKeyAuth } from "../middleware/apiKeyAuth";

const userRouter = Router();

userRouter.use(apiKeyAuth);

userRouter.post("/user", createUser);
userRouter.post("/user/login", loginUser);
userRouter.get("/user/:id", getUserById);
userRouter.delete("/user/:id", deleteUser);

export default userRouter;