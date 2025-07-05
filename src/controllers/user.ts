import { Request, Response } from "express";
import { User } from "../models/User";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const hashPassword = async (password: string) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const createUser = async (req: Request, res: Response): Promise<any> => {
  let { username, password, email, role } = req.body;

  if (!username || !password || !email || !role) {
    return res
      .status(400)
      .json({ error: "One or more required fields are missing." });
  }

  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ error: "Invalid email format.", code: "INVALID_EMAIL" });
  }

  username = validator.escape(username);
  password = validator.escape(password);
  email = validator.normalizeEmail(email) || "";
  role = validator.escape(role);

  try {
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      username,
      password: hashedPassword,
      email,
      role,
    });

    let payload = { username: user.username, email: user.email, role: user.role };
    res
      .status(201)
      .json({ message: "User created successfully", user: payload });
  } catch (err) {
    console.error("Create User Error:", err);
    res.status(500).json({ error: "Failed to create user." });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "One or more required fields are missing." });
  }

  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ error: "Invalid email format.", code: "INVALID_EMAIL" });
  }

  email = validator.normalizeEmail(email) || "";

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login User Error:", err);
    res.status(500).json({ error: "Failed to login user." });
  }
};

export const getAllUsers = async (
  _req: Request,
  res: Response
): Promise<any> => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    console.error("Get All Users Error:", err);
    res.status(500).json({ error: "Failed to retrieve users." });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Get User By ID Error:", err);
    res.status(500).json({ error: "Failed to retrieve user." });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const deletedCount = await User.destroy({ where: { id } });
    if (deletedCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(204).send();
  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).json({ error: "Failed to delete user." });
  }
};
