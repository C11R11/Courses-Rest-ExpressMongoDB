import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

mongoose
  .connect(process.env.DATABASE_CONECCTION_DOCKER)
  .then(() => console.log("DB connection successful!"));

const appModule = require("./app");
const PORT = 3456;

appModule.startServer(PORT);
