import { Response } from "express";
import HttpStatusCode from "./http_status_code";

const successResponse = (
  response: Response,
  data: any,
  statusCode: number,
  metadata: any = {}
) => {
  // console.log(data);

  response.status(statusCode).json({
    data,
    metadata,
  });
};

export { successResponse };
