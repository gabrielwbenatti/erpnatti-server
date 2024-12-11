import { Request, Response, NextFunction } from "express";
import { IController } from "../interfaces/IController";
import { HttpError } from "../helpers/http_error";
import { HttpStatusCode } from "../helpers/http_status_code";
import stockMovementsService from "../services/StockMovementsService";
import { successResponse } from "../helpers/http_responses";

class StockMovementsController implements IController {
  index(req: Request, res: Response, next?: NextFunction): Promise<void> {
    throw new HttpError(
      "Method not implemented",
      HttpStatusCode.NOT_IMPLEMENTED
    );
  }

  store(req: Request, res: Response, next?: NextFunction): Promise<void> {
    throw new HttpError(
      "Method not implemented",
      HttpStatusCode.NOT_IMPLEMENTED
    );
  }

  async show(req: Request, res: Response, next?: NextFunction): Promise<void> {
    const productId = req.params.id;

    try {
      const stockMovements = await stockMovementsService.showMovements(
        +productId
      );

      if (stockMovements) {
        successResponse(res, stockMovements, HttpStatusCode.OK);
      }
    } catch (error) {
      return next?.(error);
    }
  }

  update(req: Request, res: Response, next?: NextFunction): Promise<void> {
    throw new HttpError(
      "Method not implemented",
      HttpStatusCode.NOT_IMPLEMENTED
    );
  }

  remove(req: Request, res: Response, next?: NextFunction): Promise<void> {
    throw new HttpError(
      "Method not implemented",
      HttpStatusCode.NOT_IMPLEMENTED
    );
  }
}

export default new StockMovementsController();
