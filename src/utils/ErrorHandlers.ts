import AppError from "../utils/appError";

/**
 * This function parses the error and see if can extract information 
 * to provide to end users
 * @param err the error that comes from the controllers
 * @returns the digest user error
 */
function MakeProductionMessages(err) {

  let userError = {
    status: err.status,
    message: err.message,
  };

  if (err.name === "CastError") {
      userError.status = "Cast Error"
      userError.message = `Invalid ${err.path}: ${{...err.value}}.`
  }

  else if (err.name === "ValidationError") {
    userError.status = "Validation error";
    userError.message = err.errors;
  }

  else if (err.code === 11000) {
    userError.status = "Duplicated value"
    userError.message = err.message
  }

  return userError
}

export default (err, req, res, next) => {
  console.log(err.stack);
  //If it's defined or 500 (server error)
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  const userError = MakeProductionMessages(err);

  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
      user_error: userError
    });
  } else if (process.env.NODE_ENV === "production") {
      console.error("Error 💣 ", err);

      res.status(500).json({
        status: err.status,
        message: err.message,
      });
  }
};
