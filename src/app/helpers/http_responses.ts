import { Response } from "express";
import HttpStatusCode from "./http_status_code";

const successResponse = (
  response: Response,
  statusCode: number = HttpStatusCode.OK,
  data: any,
  metadata: any = {}
) => {
  response.status(statusCode).json({
    data,
    metadata,
  });
};

export { successResponse };
