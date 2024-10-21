import { Request, Response } from "express";
import purchasesService from "../services/purchases.service";
import { successResponse } from "../helpers/http_responses";
import purchasesValidador from "../validators/purchases.validador";
import { HttpStatusCode } from "../helpers/http_status_code";

class PurchasesController {
  getPurchases = async (req: Request, res: Response) => {
    const {} = req.query;

    const result = await purchasesService.getPurchases({});

    if (result) {
      successResponse(res, result, HttpStatusCode.OK, {
        count: result.length,
      });
    }
  };

  createPurchase = async (req: Request, res: Response) => {
    const body = req.body;
    const {
      pessoa_id,
      numero_documento,
      serie_documento,
      data_emissao,
      data_entrada,
    } = body;

    if (!pessoa_id)
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ message: "Field 'pessoa_id' is required" });

    if (!numero_documento)
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ message: "Field 'numero_documento' is required" });

    if (!serie_documento)
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ message: "Field 'serie_documento' is required" });

    if (!data_emissao || !data_entrada)
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Fields 'data_emissao' and 'data_entrada' are required",
      });

    if (pessoa_id && numero_documento && serie_documento) {
      const isDuplicate = await purchasesValidador.isPurchaseDuplicated(
        pessoa_id,
        numero_documento,
        serie_documento
      );

      if (isDuplicate)
        return res
          .status(HttpStatusCode.CONFLICT)
          .json({ message: "Duplicate purchase" });
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

  updatePurchase = async (req: Request, res: Response) => {
    const id = req.params.id;
    const body = req.body;

    const result = await purchasesService.updatePurchase(+id, body);

    if (result) {
      successResponse(res, result, HttpStatusCode.OK);
    }
  };
}

export default new PurchasesController();
