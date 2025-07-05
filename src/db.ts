import { Sequelize } from "sequelize-typescript";
import { Contact } from "./models/Contact";
import { User } from "./models/User";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(process.env.RENDER_STRING as string, {
  dialect: "postgres",
  models: [Contact, User],
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
