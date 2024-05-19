import mongoose from "mongoose";
import { IAlbum, IUser } from "../types/models";
import ModelsDecorators from "./ModelsDecorators";
import bcrypt from "bcryptjs";

export default class UserModel {
  static userSchema = new mongoose.Schema<IUser>({
    name: {
      type: String,
      required: [true, "It's needed an artist?"],
      unique: false,
    },
    email: {
      type: String,
      required: [true, "Please provide your email!"],
      unique: true,
      lowercase: true,
      //validate: [validator.isEmail, "please provide a valid email"]
    },
    //a place in filesystem where the phone is
    photo: { type: String, default: "no photo" },
    password: {
      type: String,
      required: [true, "Please provide your password"],
      minlength: 10,
      unique: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password"],
      unique: false,
      validate: {
        /**
         * ...from mongodb documentation
         *      "...Schema validation is most useful for an established application
         *      here you have a good sense of how to organize your data."
         *
         *     "... For documents that already exist in your collection prior to
         *     adding validation, you can specify how MongoDB applies validation
         *     rules to these documents"
         *
         *     strict Validation Level: (Default) MongoDB applies the same validation 
         *                              rules to all document inserts and updates.
         * 
         *     moderate Validation level: MongoDB applies the same validation rules 
         *                                to document inserts and updates to existing 
                                          valid documents that match the validation rule

             https://www.mongodb.com/docs/manual/core/schema-validation/specify-validation-level/#std-label-schema-specify-validation-level
         */
        //
        validator: function (el) {
          return el === this.password;
        },
      },
    },
  });
  static usersModel;

  constructor() {}

  public async CreateUser(obj: IAlbum) {
    console.log("creating user....");
    try {
      const newModel = await UserModel.usersModel.create(obj);
      return newModel;
    } catch (err) {
      console.log("💣 ", err);
      throw err;
    }
  }

  public async GetAllUsers(queryString: string) {
    try {
      const features = new ModelsDecorators(
        UserModel.usersModel.find(),
        queryString
      )
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
}

UserModel.userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  /**
   * Here the rounds for the bcrypsjs library is 10 to be quicker to 
   * process. Maybe for productions environments (or better hardware)
   * this can be increcased
   */
  const rounds = 10
  
  this.password = await bcrypt.hash(this.password, rounds);
  // this will erase the confirmation email. This happens after validate
  // that the user already send the password and confirmation
  this.confirmPassword = undefined;
  next();
});

UserModel.usersModel = mongoose.model("Users", UserModel.userSchema); 