import {AppError} from "../utils/appError";
import userModel from "../models/userModel";

const userModelImpl = new userModel();

async function GetAllUsers(req, res) {
  try {
    const albums = await userModelImpl.GetAllUsers(req.query);
    res.status(200).json({
      status: "success",
      results: albums.length,
      data: albums,
    });
  } catch (err) {
    console.log("GetAllAlbums--as", err);
    res.status(404).json({ status: "fail", message: err });
  }
}

async function GetUser(req, res, next) {
  try {
    let user = await userModelImpl.GetUser(req.params.id);
    
    //no tour found
    if (user.length == 0)
      return next(new AppError("No user found with the given ID", 404));

    user = user[0];
     console.log("user before delete---", user);
    
    user.password = undefined

    console.log("user after delete---", user)

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

export default { GetAllUsers, GetUser };
