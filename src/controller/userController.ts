import AppError from "../utils/appError";
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

export default { GetAllUsers };
