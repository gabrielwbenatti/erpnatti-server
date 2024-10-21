import { Router } from "express";
import purchaseController from "../../controllers/purchases.controller";

const router = Router();

router
  .route("/")
  .get(purchaseController.getPurchases)
  .post(purchaseController.createPurchase);

router
  .route("/:id")
  .get(purchaseController.showPurchase)
  .put(purchaseController.updatePurchase);

export default router;
