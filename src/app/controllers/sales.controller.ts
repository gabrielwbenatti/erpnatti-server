import { Request, Response } from "express";
import salesService from "../services/sales.service";
import { successResponse } from "../helpers/http_responses";
import { HttpStatusCode } from "../helpers/http_status_code";

class SalesController {
  getSales = async (req: Request, res: Response) => {
    const result = await salesService.getSales();

    if (result) {
      successResponse(res, result, HttpStatusCode.OK, {
        count: result.length,
      });
    }
  };

  createSales = async (req: Request, res: Response) => {
    const body = req.body;
    const result = await salesService.createSales(body);

    if (result) {
      successResponse(res, result, HttpStatusCode.CREATED);
    }
  };

  showSales = async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await salesService.showSales(+id);

    if (result) {
      successResponse(res, result, HttpStatusCode.OK);
    }
  };

  deleteSale = async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await salesService.deleteSale(+id);

    if (result) {
      successResponse(res, result, HttpStatusCode.OK);
    }
  };
}

export default new SalesController();
