import { Response } from "express";
import HttpStatusCode from "./http_status_code";

const successResponse = (
  response: Response,
  result: any,
  statusCode: number,
  metadata: any = {}
) => {
  response.status(statusCode).json({
    result: result,
    meta: metadata,
  });
};

export { successResponse };
