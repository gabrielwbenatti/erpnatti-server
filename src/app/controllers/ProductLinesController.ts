import { Request, Response, NextFunction } from "express";
import { IController } from "../interfaces/IController";

import productLinesServices from "../services/ProductLinesServices";
import { successResponse } from "../helpers/http_responses";
import { HttpStatusCode } from "../helpers/http_status_code";
import { MissingFieldError } from "../helpers/http_error";

class ProductLinesController implements IController {
  async index(req: Request, res: Response, _?: NextFunction): Promise<void> {
    const result = await productLinesServices.getLines();

    if (result) {
      successResponse(res, result, HttpStatusCode.OK, { count: result.length });
    }
  }

  async store(req: Request, res: Response, next?: NextFunction): Promise<void> {
    const body = req.body;
    const { name } = body;

    try {
      if (!name) throw new MissingFieldError("name");

      const result = await productLinesServices.createLine(body);

      if (result.id) {
        successResponse(res, result, HttpStatusCode.CREATED);
      }
    } catch (error) {
      next?.(error);
    }
  }

  async show(req: Request, res: Response, _?: NextFunction): Promise<void> {
    const id = req.params.id;

    const result = await productLinesServices.showLine(+id);

    if (result) {
      successResponse(res, result, HttpStatusCode.OK);
    }
  }

  async update(
    req: Request,
    res: Response,
    next?: NextFunction
  ): Promise<void> {
    const id = req.params.id;
    const body = req.body;
    const { name } = body;

    try {
      if (!name) throw new MissingFieldError("name");

      const result = await productLinesServices.updateLine(+id, body);

      if (result) {
        successResponse(res, result, HttpStatusCode.OK);
      }
    } catch (error) {
      next?.(error);
    }

    throw new Error("Method not implemented.");
  }

  async remove(
    req: Request,
    res: Response,
    next?: NextFunction
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export default new ProductLinesController();
