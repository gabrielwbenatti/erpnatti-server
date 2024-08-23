import { Router } from "express";
import purchaseController from "../../controllers/purchase.controller";

const router = Router();

router.route("/").post(purchaseController.createPurchase);

router.route("/:id").get(purchaseController.showPurchase);

export default router;
