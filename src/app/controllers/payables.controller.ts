import { Request, Response } from "express";
import payablesService from "../services/payables.service";
import { successResponse } from "../helpers/http_responses";
import { HttpStatusCode } from "../helpers/http_status_code";

class PayablesController {
  index = async (_: Request, res: Response) => {
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

  show = async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await payablesService.show(+id);

    if (result) successResponse(res, result, HttpStatusCode.OK);
  };

  update = async (req: Request, res: Response) => {};

  remove = async (req: Request, res: Response) => {};
}

export default new PayablesController();
