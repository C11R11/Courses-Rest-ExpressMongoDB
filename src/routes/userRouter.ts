import express from "express";
import userController from "../controller/userController"
import authController from "../controller/authController";

const { GetAllUsers } = userController;
const { Signup } = authController;

const router = express.Router();

/**
 * The main reasoning behing sepparate the signin endpoint it's the 
 * scope. For signup we only using a post request against users
 * resorce. This route will become one of the no secure endpoints
 * at the end of the rest api development.
 */
router.post("/signup", Signup); 

router.route("/").get(GetAllUsers).post(Signup);
//router.route("/:id").get(GetUser).patch(UpdateUser).delete(DeleteUser);

export = router