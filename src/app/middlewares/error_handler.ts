import { NextFunction, Request, Response } from "express";
import { HttpError } from "../helpers/http_error";
import { HttpStatusCode } from "../helpers/http_status_code";

export default function errorHandler(
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    status: "error",
    message: `Internal Server Error: ${err}`,
  });
}
