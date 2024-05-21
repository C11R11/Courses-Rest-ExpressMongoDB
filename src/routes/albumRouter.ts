import express from "express";
import albumController from "../controller/albumController";
import authController from "../controller/authController";

const { GetAllAlbums, DeleteAlbum, CreatAlbum, GetAlbum, UpdateAlbum } =
  albumController;

const { verifyToken } = authController;

const router = express.Router();

router.route("/").get(verifyToken, GetAllAlbums).post(verifyToken, CreatAlbum);
router
  .route("/:id")
  .get(verifyToken, GetAlbum)
  .patch(verifyToken, UpdateAlbum)
  .delete(verifyToken, DeleteAlbum);

export = router;
