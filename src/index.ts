import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

mongoose
  .connect(process.env.DATABASE_CONECCTION_DOCKER)
  .then(() => console.log("DB connection successful!"));

const appModule = require("./app");
const PORT = 3456;

appModule.startServer(PORT);


/**
 * Uncaught exception such a loss database connection are handled here
 */
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("unrecover error shutting down 💣 ");
  process.exit(1);
});