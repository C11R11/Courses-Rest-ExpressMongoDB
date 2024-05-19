import express from "express";
import { json } from "express";
import morgan from "morgan";
import albumsRouter from "./routes/albumRouter";
import usersRouter from "./routes/userRouter";
import dotenv from "dotenv";
import AppError from "./utils/appError";
import ErrorHandlers from "./utils/ErrorHandlers";

dotenv.config({ path: "./config.env" });

const app = express();

app.use(morgan("dev"));

//this one here is an important middleware to capture the users json data
app.use(json());

function ApiStatus(req, res) {
  res.status(200).json({
    status: "success",
    data: {},
  });
}

app.use("/api/v2/users", usersRouter);
app.use("/api/v2/albums", albumsRouter);
app.route("/api/v2/status").get(ApiStatus);

interface ErrorWithStatus extends Error {
  status: string;
  statusCode: Number;
}

app.all("*", (req, res, next) => 
  {
    //with this automatically pass the error and cancel the middleware chain
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
  })

//error handler middleware
app.use(ErrorHandlers)

function startServer(port: number) {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Music Api info :) http://localhost:${port}`);
  });

  /**
   * Uncaught exception such a loss database connection are handled here
   */
  process.on("uncaughtException", (err) => {
    console.log(err.name, err.message);
    console.log("unrecover error shutting down 💣 ");
    process.exit(1);
  });
}

module.exports = {
  app: app,
  startServer: startServer,
};
