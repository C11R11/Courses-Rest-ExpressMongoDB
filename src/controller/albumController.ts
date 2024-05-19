import AppError from "../utils/appError";
import albumModel from "../models/albumModel";

const albumModelImpl = new albumModel();

async function GetAllAlbums(req, res) {
  try {
    const albums = await albumModelImpl.GetAllAlbums(req.query);
    res.status(200).json({
      status: "success",
      results: albums.length,
      data: albums,
    });
  } catch (err) {
    console.log("GetAllAlbums--as", err)
    res.status(404).json({ status: "fail", message: err });
  }
}

async function GetAlbum(req, res, next) {
  try {
    const album = await albumModelImpl.GetAlbum(req.params.id);

    //no tour found
    if(album.length == 0) return next(new AppError("No tour found with the given ID", 404))

    res.status(200).json({
      status: "success",
      data: album,
    });
  } catch (err) {
    next(err)
  }
}

const UpdateAlbum = async (req, res, next) => {
  try {
    const result = await albumModelImpl.UpdateAlbum(req.params.id, req.body);

    if (result.length == 0)
      return next(new AppError("No tour found with the given ID", 404));

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
     next(err);
  }
};

const CreatAlbum = async (req, res, next) => {
  try {
    console.log("Controller, create album->", req.body);

    const newAlbum = await albumModelImpl.CreateAlbum(req.body);
    console.log("after new album");

    res.status(201).json({
      status: "success",
      data: newAlbum,
    });
  } catch (err) {
    next(err)
  }
};

const DeleteAlbum = async (req, res, next) => {
  try {
    const result = await albumModelImpl.DeleteAlbum(req.params.id);

    if (result === null)
      return next(new AppError("No tour found with the given ID", 404));

    res.status(200).json({
      status: "Ok",
    });
  } catch (err) {
    next(err);
  }
};

const exp = { GetAllAlbums, DeleteAlbum, CreatAlbum, GetAlbum, UpdateAlbum };
export default exp;
