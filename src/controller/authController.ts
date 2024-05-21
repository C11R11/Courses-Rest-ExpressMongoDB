import { AppError, AuthError} from "../utils/appError";
import userModel from "../models/userModel";
import { sign, verify, JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";

interface CustomJwtPayload extends JwtPayload {
  id: string
  email:string
}

const userModelImpl = new userModel();

async function verifyToken(req, res, next) {
  let token

  console.log(req.headers)

  if(req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) token = req.headers.authorization.split(' ')[1]

  if (!token) {
    return next(new AuthError("Token not provied"));
  }
  try {
    //verifiyng the token
    const payload = verify(token, process.env.JWT_PASS) as CustomJwtPayload;

    //verifiyng that the token user exists
      const user = await userModelImpl.GetUser(payload.id);
    //  //no tour found
     if (user.length == 0)
        return next(new AuthError("No user found with the given ID"));

    //verifiung that the user password don't change

    next();
  } catch (error) {
    return next(new AuthError("Token not valid, login again 💣 "));
    }
}

const Signup = async (req, res, next) => {
  try {
    console.log("Controller, create album->", req.body);

    const newUser = await userModelImpl.CreateUser(req.body);
    console.log("after new album");

    newUser.password = undefined;
    //jwt sign
    const token = sign({ id: newUser._id }, process.env.JWT_PASS, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const cookieOptions = {
      expires: new Date(
        Date.now() + Number(process.env.JWT_COOKIE_EXPIRES) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    //if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

    res.cookie("jwt", token, cookieOptions);

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
        new AuthError("Please provided valid email and password")
      );
    }

    //2)Check if user exists and password
    let user = await userModelImpl.GetUserEmail(email);
    user = user[0]

    //no tour found
    if (typeof(user) === undefined)
      return next(new AppError("Authorization error: No user found with the provided token", 401));

    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) return next(new AuthError("Invalid password"));
    
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

async function GetUser(req, res, next) {
  try {
    const user = await userModelImpl.GetUser(req.params.id)[0];

    //no tour found
    if (typeof user === undefined)
      return next(new AuthError("No tour found with the given ID"));

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

export default { Signup, Login, verifyToken };
