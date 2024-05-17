import express from "express";
import albumController from "../controller/albumController";

const { GetAllAlbums, DeleteAlbum, CreatAlbum, GetAlbum, UpdateAlbum } =
  albumController;

const router = express.Router();

router.route("/").get(GetAllAlbums).post(CreatAlbum);
router.route("/:id").get(GetAlbum).patch(UpdateAlbum).delete(DeleteAlbum);

export = router;
