import { Request, Response } from "express";
import purchasesService from "../services/purchases.service";

class PurchasesController {
  createPurchase = async (req: Request, res: Response) => {
    const body = req.body;
    const purchase = await purchasesService.createPurchase(body);

    if (purchase) {
      await purchasesService.createPurchaseItems(body, purchase.id);
    }

    res.send(purchase);
  };

  showPurchase = async (req: Request, res: Response) => {
    const id = req.params.id;
    const purchase = await purchasesService.showPurchase(+id);

    res.send(purchase);
  };
}

export default new PurchasesController();
