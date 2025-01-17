import { Response } from "express";

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
