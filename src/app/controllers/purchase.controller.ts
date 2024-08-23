import { Request, Response } from "express";
import purchaseService from "../services/purchase.service";

class PurchaseController {
  createPurchase = async (req: Request, res: Response) => {
    const body = req.body;
    const purchase = await purchaseService.createPurchase(body);

    res.send(purchase);
  };

  showPurchase = async (req: Request, res: Response) => {
    const id = req.params.id;
    const purchase = await purchaseService.showPurchase(+id);

    res.send(purchase);
  };
}

export default new PurchaseController();
