import { Router } from "express";
import payablesController from "../../controllers/payables.controller";

const router = Router();

router.route("/").get(payablesController.index).post(payablesController.store);

router.route("/:id").get(payablesController.show);

export default router;
