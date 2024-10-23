import { Router } from "express";
import purchaseController from "../../controllers/purchases.controller";

const router = Router();

router.route("/").get(purchaseController.index).post(purchaseController.store);

router
  .route("/:id")
  .get(purchaseController.show)
  .put(purchaseController.update)
  .delete(purchaseController.remove);

export default router;
