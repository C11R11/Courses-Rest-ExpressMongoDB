export class AppError extends Error {
  status: string;
  statusCode: Number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    //the parent class gets the message
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
  }
}

export class AuthError extends Error {
  status: string;
  statusCode: Number;
  isOperational: boolean;

  constructor(message: string) {
    //the parent class gets the message
    super(message);
    this.statusCode = 401;
    this.status = "Auth error";
  }
}
