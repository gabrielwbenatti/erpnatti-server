import { Router } from "express";
import salesController from "../../controllers/sales.controller";

const router = Router();

router
  .get("/", salesController.getSales)
  .post("/", salesController.createSales);

router
  .get("/:id", salesController.showSales)
  .delete("/:id", salesController.deleteSale);

export default router;
