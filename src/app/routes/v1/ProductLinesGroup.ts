import { Router } from "express";

import productLinesController from "../../controllers/ProductLinesController";

const router = Router();

router
  .route("/")
  .get(productLinesController.index)
  .post(productLinesController.store);

router.route("/:id").get(productLinesController.show);

export default router;
