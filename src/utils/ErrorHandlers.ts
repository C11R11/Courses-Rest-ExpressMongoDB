export default (err, req, res, next) =>
  {
    console.log(err.stack)
    //If it's defined or 500 (server error)
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

  }