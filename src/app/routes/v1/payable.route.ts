import { Router } from "express";
import payablesController from "../../controllers/payables.controller";

const router = Router();

router.route("/").get(payablesController.index).post(payablesController.store);

export default router;
