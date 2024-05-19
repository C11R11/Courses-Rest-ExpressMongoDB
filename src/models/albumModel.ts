import mongoose from "mongoose";
import {IAlbum} from "../types/models"
import ModelsDecorators from "./ModelsDecorators";

class AlbumModel {
  albumSchema = new mongoose.Schema<IAlbum>({
    artist: {
      type: String,
      required: [true, "It's needed an artist?"],
      unique: true,
    },
    genre: { type: String, required: [true, "It's needed an ?"] },
    label: String,
    selling_information: {
      certifications: String,
      sales: String,
    },
    singles: [String],
    title: {
      type: String,
      required: [true, "It's needed an artist?"],
      unique: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    /* createdAt: {
      type: Date,
      default: new Date(Date.now()),
      select: false,
    }, */
    ratingsAverage: {
      type: Number,
      default: 3,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    tracks: [String],
    year: Number,
  });
  albumModel: mongoose.Model<IAlbum>;

  constructor() {
    this.albumModel = mongoose.model("Album", this.albumSchema);
  }

  public async CreateAlbum(obj: IAlbum) {
    console.log("creating album....");
    try {
      const newModel = await this.albumModel.create(obj);
      return newModel;
    } catch (err) {
      console.log("💣 ", err)
      throw err;
    }
  }

  public async GetAlbum(id: String) {
    console.log("GetAlbum album....");
    try {
      const findModel = await this.albumModel.find({ _id: id }).exec();
      console.log(findModel);
      return findModel;
    } catch (err) {
      console.log("💣 ", err);
      throw err;
    }
  }

  public async GetAllAlbums(queryString: string) {
    
    try {
      const features = new ModelsDecorators(this.albumModel.find(), queryString)
        .filter()
        .sort()
        .limitFields()
        .paginate();

      const findModel = await features.query;
      return findModel;
      console.log("GetAlbum album....", findModel);
    } catch (err) {
      throw err;
    }
  }

  public async DeleteAlbum(id: String) {
    console.log("DeleteAlbum album....");
    try {
      const findModel = await this.albumModel.findByIdAndDelete({ _id: id });
      return findModel;
    } catch (err) {
      throw err;
    }
  }

  public async UpdateAlbum(id: String, obj: mongoose.UpdateQuery<IAlbum>) {
    console.log("UpdateAlbum album....");
    try {
      const findModel = await this.albumModel.findByIdAndUpdate(id, obj).exec();
      return await this.GetAlbum(id);
    } catch (err) {
      throw err;
    }
  }
}

async function main() {
  mongoose
    .connect("mongodb://admin:51075102@192.168.1.86:27017/MusicHistory")
    .then(() => console.log("DB connection successful!"));

  const x = new AlbumModel();
  const y = new Date();
  const out = await x.CreateAlbum({
    title: "Supertest2!",
    artist: "Supertest",
    genre: "Supertest",
    ratingsAverage: 1,
    ratingsQuantity: 0,
    year: 2024,
    tracks: ["Supertest"],
    label: "Supertest",
    selling_information: {
      certifications: "No info",
      sales: "No info",
    },
    imageCover: "asdasd",
    images: ["asd"],
    //createdAt: new Date(Date.now()).toISOString(), 
    singles: ["Supertest"],
  });

  console.log(out);
}

//main().then((res) => console.log(res, "res end")).catch((err) => console.log(err));
/*
const albumSchema = new mongoose.Schema<IAlbumSchema>({
  artist: {
    type: String,
    required: [true, "It's needed an artist?"],
    unique: true,
  },
  genre: { type: String, required: [true, "It's needed an ?"] },
  label: String,
  selling_information: {
    certifications: String,
    sales: String,
  },
  singles: [String],
  title: {
    type: String,
    required: [true, "It's needed an artist?"],
    unique: true,
  },
  tracks: [String],
  year: Number,
});

const AlbumModel = mongoose.model<IAlbumSchema>("Album", albumSchema);*/
export default AlbumModel;
