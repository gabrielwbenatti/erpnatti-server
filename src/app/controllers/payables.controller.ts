import { Request, Response } from "express";
import payablesService from "../services/payables.service";
import { successResponse } from "../helpers/http_responses";
import { HttpStatusCode } from "../helpers/http_status_code";

class PayablesController {
  index = async (req: Request, res: Response) => {
    const {} = req.query;

    const result = await payablesService.getPayables({});

    if (result) {
      successResponse(res, result, HttpStatusCode.OK, {
        count: result.length,
      });
    }
  };

  store = async (req: Request, res: Response) => {
    const body = Array.isArray(req.body) ? Array.from(req.body) : [req.body];

    const result = await payablesService.createPayable(body);

    if (result) successResponse(res, result, HttpStatusCode.CREATED);
  };

  show = async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await payablesService.show(+id);

    if (result) successResponse(res, result, HttpStatusCode.OK);
  };

  update = async (req: Request, res: Response) => {};

  remove = async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await payablesService.remove(+id);

    if (result) successResponse(res, result, HttpStatusCode.OK);
  };
}

export default new PayablesController();
