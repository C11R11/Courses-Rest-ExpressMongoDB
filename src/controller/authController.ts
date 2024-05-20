import AppError from "../utils/appError";
import userModel from "../models/userModel";
import { sign } from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userModelImpl = new userModel();
const Signup = async (req, res, next) => {
  try {
    console.log("Controller, create album->", req.body);

    const newUser = await userModelImpl.CreateUser(req.body);
    console.log("after new album");

    //jwt sign
    const token = sign({ id: newUser._id }, process.env.JWT_PASS, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({
      status: "success",
      token,
      data: newUser,
    });
  } catch (err) {
    next(err);
  }
};

const Login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    //1) check email and password
    if (!email || !password) {
      return next(
        new AppError("Please provided valid email and password", 400)
      );
    }

    //2)Check if user exists and password
    const user = await userModelImpl.GetUserEmail(email);
    //no tour found
    if (user.length == 0)
      return next(new AppError("No user found with the given ID", 401));

    const checkPassword = await bcrypt.compare(password, user[0].password)

    if (!checkPassword) return next(new AppError("Invalid password", 401));
    
    //3) send token back
    const token = sign({ id: user._id }, process.env.JWT_PASS, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({
      status: "success",
      token,
    });
  } catch (err) {
    next(err);
  }
};

async function GetAlbum(req, res, next) {
  try {
    const album = await userModelImpl.GetUser(req.params.id);

    //no tour found
    if (album.length == 0)
      return next(new AppError("No tour found with the given ID", 404));

    res.status(200).json({
      status: "success",
      data: album,
    });
  } catch (err) {
    next(err);
  }
}

export default { Signup, Login };