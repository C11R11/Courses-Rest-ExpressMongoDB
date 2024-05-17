import express from "express";
import userController from "../controller/userController"

const { GetAllUsers, CreateUser, GetUser, UpdateUser, DeleteUser } =
  userController;

const router = express.Router();


router.route("/").get(GetAllUsers).post(CreateUser);
router.route("/:id").get(GetUser).patch(UpdateUser).delete(DeleteUser);

export = router