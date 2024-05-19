import AppError from "../utils/appError";
import userModel from "../models/userModel";

const userModelImpl = new userModel();
const Signup = async (req, res, next) => {
  try {
    console.log("Controller, create album->", req.body);

    const newAlbum = await userModelImpl.CreateUser(req.body);
    console.log("after new album");

    res.status(201).json({
      status: "success",
      data: newAlbum,
    });
  } catch (err) {
    next(err);
  }
};

export default { Signup };