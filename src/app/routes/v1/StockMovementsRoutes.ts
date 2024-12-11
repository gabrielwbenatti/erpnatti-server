import { Router } from "express";
import stockMovementsController from "../../controllers/StockMovementsController";

const router = Router();

router.get("/:id", stockMovementsController.show);

export default router;
