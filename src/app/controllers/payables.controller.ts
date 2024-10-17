import { Request, Response } from "express";
import payablesService from "../services/payables.service";
import { successResponse } from "../helpers/http_responses";
import HttpStatusCode from "../helpers/http_status_code";

class PayablesController {
  index = async (req: Request, res: Response) => {
    const result = await payablesService.getPayables(undefined);

    if (result) {
      successResponse(res, result, HttpStatusCode.OK, {
        count: result.length,
      });
    }
  };

  store = async (req: Request, res: Response) => {
    const body = req.body;
    const result = await payablesService.createPayable(body);

    if (result) successResponse(res, result, HttpStatusCode.CREATED);
  };

  show = async (req: Request, res: Response) => {};

  update = async (req: Request, res: Response) => {};

  remove = async (req: Request, res: Response) => {};
}

export default new PayablesController();
