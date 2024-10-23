import { Request, Response } from "express";
import purchasesService from "../services/purchases.service";
import { successResponse } from "../helpers/http_responses";
import purchasesValidador from "../validators/purchases.validador";
import { HttpStatusCode } from "../helpers/http_status_code";
import { ControllerInterface } from "../interfaces/controller.interface";

class PurchasesController implements ControllerInterface {
  async index(req: Request, res: Response) {
    const {} = req.query;

    const result = await purchasesService.getPurchases({});

    if (result) {
      successResponse(res, result, HttpStatusCode.OK, {
        count: result.length,
      });
    }
  }

  async store(req: Request, res: Response) {
    const body = req.body;
    const {
      pessoa_id,
      numero_documento,
      serie_documento,
      data_emissao,
      data_entrada,
    } = body;

    if (!pessoa_id) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ message: "Field 'pessoa_id' is required" });
      return;
    }

    if (!numero_documento) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ message: "Field 'numero_documento' is required" });
      return;
    }

    if (!serie_documento) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ message: "Field 'serie_documento' is required" });
      return;
    }

    if (!data_emissao || !data_entrada) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Fields 'data_emissao' and 'data_entrada' are required",
      });
      return;
    }

    if (pessoa_id && numero_documento && serie_documento) {
      const isDuplicate = await purchasesValidador.isPurchaseDuplicated(
        pessoa_id,
        numero_documento,
        serie_documento
      );

      if (isDuplicate) {
        res
          .status(HttpStatusCode.CONFLICT)
          .json({ message: "Duplicate purchase" });
        return;
      }
    }

    const purchase = await purchasesService.createPurchase(body);

    if (purchase) {
      successResponse(res, purchase, HttpStatusCode.CREATED);
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

  remove(req: Request, res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export default new PurchasesController();
