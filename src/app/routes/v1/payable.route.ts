import { Router } from "express";
import payablesController from "../../controllers/payables.controller";

const router = Router();

router
  .get("/", payablesController.index)
  .post("/", payablesController.store)
  .get("/:id", payablesController.show)
  .delete("/:id", payablesController.remove);

export default router;
