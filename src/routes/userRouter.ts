import express from "express";
import userController from "../controller/userController"
import authController from "../controller/authController";

const { GetAllUsers, GetUser } = userController;
const { Signup, Login, verifyToken } = authController;

const router = express.Router();

/**
 * The main reasoning behing sepparate the signin endpoint it's the 
 * scope. For signup we only using a post request against users
 * resorce. This route will become one of the no secure endpoints
 * at the end of the rest api development.
 */
router.post("/signup",  Signup); 
router.post("/login", Login);

router.route("/").get(verifyToken, GetAllUsers).post(Signup);
router.route("/:id").get(verifyToken, GetUser);//.patch(UpdateUser).delete(DeleteUser);

export = router