import { NextFunction, Request, Response } from "express";
import payablesService from "../services/payables.service";
import { successResponse } from "../helpers/http_responses";
import { HttpStatusCode } from "../helpers/http_status_code";
import { ControllerInterface } from "../interfaces/controller.interface";

class PayablesController implements ControllerInterface {
  async index(req: Request, res: Response) {
    const {} = req.query;

    const result = await payablesService.getPayables({});

    if (result) {
      successResponse(res, result, HttpStatusCode.OK, {
        count: result.length,
      });
    }
  }

  async store(req: Request, res: Response, next: NextFunction) {
    const body = Array.isArray(req.body) ? Array.from(req.body) : [req.body];

    try {
      const result = await payablesService.createPayable(body);

      if (result) {
        successResponse(res, result, HttpStatusCode.CREATED);
      }
    } catch (error) {
      return next(error);
    }
  }

  async show(req: Request, res: Response) {
    const id = req.params.id;
    const result = await payablesService.showPayable(+id);

    if (result) successResponse(res, result, HttpStatusCode.OK);
  }

  async update(req: Request, res: Response) {
    const id = req.params.id;
    const body = req.body;
    const result = await payablesService.updatePayable(+id, body);

    if (result) successResponse(res, result, HttpStatusCode.OK);
  }

  async remove(req: Request, res: Response) {
    const id = req.params.id;
    const result = await payablesService.removePayable(+id);

    if (result) successResponse(res, result, HttpStatusCode.OK);
  }
}

export default new PayablesController();
