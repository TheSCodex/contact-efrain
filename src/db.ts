import { Sequelize } from "sequelize-typescript";
import { Contact } from "./models/Contact";
import { User } from "./models/User";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  models: [Contact, User],
  logging: true,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({alter: true});
    console.log("DB connected and models synced");
  } catch (error) {
    console.error("DB connection error:", error);
  }
};
