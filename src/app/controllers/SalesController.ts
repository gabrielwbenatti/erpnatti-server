import { NextFunction, Request, Response } from "express";
import salesService from "../services/SalesServices";
import { successResponse } from "../helpers/http_responses";
import { HttpStatusCode } from "../helpers/http_status_code";
import { IController } from "../interfaces/IController";

class SalesController implements IController {
  async index(req: Request, res: Response) {
    const result = await salesService.getSales();

    if (result) {
      successResponse(res, result, HttpStatusCode.OK, {
        count: result.length,
      });
    }
  }

  async store(req: Request, res: Response) {
    const body = req.body;
    const result = await salesService.createSales(body);

    if (result) {
      successResponse(res, result, HttpStatusCode.CREATED);
    }
  }

  async show(req: Request, res: Response) {
    const id = req.params.id;
    const result = await salesService.showSales(+id);

    if (result) {
      successResponse(res, result, HttpStatusCode.OK);
    }
  }

  update(req: Request, res: Response, next?: NextFunction): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async remove(req: Request, res: Response) {
    const id = req.params.id;
    const result = await salesService.deleteSale(+id);

    if (result) {
      successResponse(res, result, HttpStatusCode.OK);
    }
  }
}

export default new SalesController();
