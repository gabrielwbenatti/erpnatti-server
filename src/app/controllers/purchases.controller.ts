import { Request, Response } from "express";
import purchasesService from "../services/purchases.service";
import HttpStatusCode from "../helpers/http_status_code";
import { successResponse } from "../helpers/http_responses";
import purchasesValidador from "../validators/purchases.validador";

class PurchasesController {
  getPurchases = async (_: Request, res: Response) => {
    const result = await purchasesService.getPurchases(undefined);

    if (result) {
      successResponse(res, result, HttpStatusCode.OK, {
        count: result.length,
      });
    }
  };

  createPurchase = async (req: Request, res: Response) => {
    const body = req.body;
    const { pessoa_id, numero_documento, serie_documento } = body;

    if (pessoa_id && numero_documento && serie_documento) {
      const isDuplicate = await purchasesValidador.isPurchaseDuplicated(
        pessoa_id,
        numero_documento,
        serie_documento
      );

      if (isDuplicate)
        return res
          .status(HttpStatusCode.CONFLICT)
          .json({ message: "Duplicate Purchase" });
    }

    const purchase = await purchasesService.createPurchase(body);

    if (purchase) {
      successResponse(res, purchase, HttpStatusCode.CREATED);
    }
  };

  showPurchase = async (req: Request, res: Response) => {
    const id = req.params.id;
    const purchase = await purchasesService.showPurchase(+id);

    if (purchase) {
      successResponse(res, purchase, HttpStatusCode.OK);
    }
  };
}

export default new PurchasesController();
