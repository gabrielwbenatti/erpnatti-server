import { Request, Response } from "express";
import purchasesService from "../services/purchases.service";

class PurchasesController {
  createPurchase = async (req: Request, res: Response) => {
    const body = req.body;

    const purchaseExists = await purchasesService.showPurchase({
      pessoa_id: body.pessoa.id,
      numero_documento: body.numero_documento,
      serie_documento: body.serie_documento,
    });

    if (purchaseExists) {
      res.json({ message: "ja exite " });
      return;
    }

    const purchase = await purchasesService.createPurchase(body);

    res.send(purchase);
  };

  showPurchase = async (req: Request, res: Response) => {
    const id = req.params.id;
    const purchase = await purchasesService.showPurchase({ id: +id });

    res.send(purchase);
  };
}

export default new PurchasesController();
