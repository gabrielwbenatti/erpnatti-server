import { Router } from "express";
import purchaseController from "../../controllers/PurchasesController";

const router = Router();

router.route("/").get(purchaseController.index).post(purchaseController.store);

router
  .route("/:id")
  .get(purchaseController.show)
  .put(purchaseController.update)
  .delete(purchaseController.remove);

router.put("/:id/finish", purchaseController.finishPurchase);

export default router;
