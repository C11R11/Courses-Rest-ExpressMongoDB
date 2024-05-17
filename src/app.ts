import express from "express";
import { json } from "express";
import morgan from "morgan";
import albumsRouter from "./routes/albumRouter";
import usersRouter from "./routes/userRouter";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const app = express();

app.use(morgan("dev"));

//this one here is an important middleware to capture the users json data
app.use(json());

//custom middleware
app.use((req, res, next) => {
  console.log("Custom middleware :)");
  next();
});

function ApiStatus(req, res) {
  res.status(200).json({
    status: "success",
    data: {},
  });
}

app.use("/api/v2/users", usersRouter);
app.use("/api/v2/albums", albumsRouter);
app.route("/api/v2/status").get(ApiStatus);

function startServer(port: number) {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Music Api info :) http://localhost:${port}`);
  });
}

module.exports = {
  app: app,
  startServer: startServer,
};
