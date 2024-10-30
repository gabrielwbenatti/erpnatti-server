import { NextFunction, Request, Response } from "express";
import purchasesService from "../services/PurchasesServices";
import { successResponse } from "../helpers/http_responses";
import purchasesValidador from "../validators/PurchasesValidator";
import { HttpStatusCode } from "../helpers/http_status_code";
import { IController } from "../interfaces/IController";
import {
  DuplicatedRecordError,
  MissingFieldError,
} from "../helpers/http_error";

class PurchasesController implements IController {
  async index(req: Request, res: Response) {
    const {} = req.query;

    const result = await purchasesService.getPurchases({});

    if (result) {
      successResponse(res, result, HttpStatusCode.OK, {
        count: result.length,
      });
    }
  }

  async store(req: Request, res: Response, next: NextFunction) {
    const body = req.body;
    const { person_id, document_number, document_series } = body;

    try {
      if (!person_id) throw new MissingFieldError("person_id");

      if (!document_number) throw new MissingFieldError("document_number");

      if (!document_series) throw new MissingFieldError("document_series");

      if (person_id && document_number && document_series) {
        const isDuplicate = await purchasesValidador.isPurchaseDuplicated(
          person_id,
          document_number,
          document_series
        );

        if (isDuplicate)
          throw new DuplicatedRecordError(
            "purchase",
            "person_id, document_number and document_series"
          );
      }

      const purchase = await purchasesService.createPurchase(body);

      if (purchase) {
        successResponse(res, purchase, HttpStatusCode.CREATED);
      }
    } catch (error) {
      return next(error);
    }
  }

  async show(req: Request, res: Response) {
    const id = req.params.id;
    const purchase = await purchasesService.showPurchase(+id);

    if (purchase) {
      successResponse(res, purchase, HttpStatusCode.OK);
    }
  }

  async update(req: Request, res: Response) {
    const id = req.params.id;
    const body = req.body;

    const result = await purchasesService.updatePurchase(+id, body);

    if (result) {
      successResponse(res, result, HttpStatusCode.OK);
    }
  }

  async remove(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const result = purchasesService.deletePurchase(+id);

    if (result) {
      successResponse(res, result, HttpStatusCode.OK);
    }
  }

  async finishPurchase(req: Request, res: Response) {
    const id = req.params.id;
    const body = req.body;

    const result = await purchasesService.finishPurchase(+id, body);

    if (result) {
      successResponse(res, result, HttpStatusCode.OK);
    }
  }
}

export default new PurchasesController();
