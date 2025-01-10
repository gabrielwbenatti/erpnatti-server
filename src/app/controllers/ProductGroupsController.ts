import { Request, Response, NextFunction } from "express";
import { IController } from "../interfaces/IController";
import productGroupsService from "../services/ProductGroupsServices";
import { successResponse } from "../helpers/http_responses";
import { HttpStatusCode } from "../helpers/http_status_code";
import { MissingFieldError } from "../helpers/http_error";

class ProductGroupsController implements IController {
  async index(req: Request, res: Response, _?: NextFunction): Promise<void> {
    const result = await productGroupsService.getGroups();

    if (result) {
      successResponse(res, result, HttpStatusCode.OK, { count: result.length });
    }
  }

  async store(req: Request, res: Response, next?: NextFunction): Promise<void> {
    const body = req.body;
    const { name } = body;

    try {
      if (!name) throw new MissingFieldError("name");

      const result = await productGroupsService.createGroup(body);

      if (result.id) {
        successResponse(res, result, HttpStatusCode.CREATED);
      }
    } catch (error) {
      return next?.(error);
    }
  }

  async show(req: Request, res: Response, _?: NextFunction): Promise<void> {
    const id = req.params.id;
    const result = await productGroupsService.showGroup(+id);

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

      const result = await productGroupsService.updateGroup(+id, body);

      if (result) {
        successResponse(res, result, HttpStatusCode.OK);
      }
    } catch (error) {
      return next?.(error);
    }
  }

  remove(req: Request, res: Response, next?: NextFunction): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export default new ProductGroupsController();
