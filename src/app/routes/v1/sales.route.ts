import { Router } from "express";
import salesController from "../../controllers/SalesController";

const router = Router();

router
  .get("/", salesController.getSales)
  .post("/", salesController.createSales);

router
  .get("/:id", salesController.showSales)
  .delete("/:id", salesController.deleteSale);

export default router;
