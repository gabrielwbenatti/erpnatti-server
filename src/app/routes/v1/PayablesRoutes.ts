import { Router } from "express";
import payablesController from "../../controllers/PayablesController";

const router = Router();

router.route("/").get(payablesController.index).post(payablesController.store);

router
  .route("/:id")
  .get(payablesController.show)
  .put(payablesController.update)
  .delete(payablesController.remove);

export default router;
