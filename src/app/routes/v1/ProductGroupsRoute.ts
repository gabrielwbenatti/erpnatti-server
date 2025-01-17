import { Router } from "express";

import productGroupsController from "../../controllers/ProductGroupsController";

const router = Router();

router
  .route("/")
  .get(productGroupsController.index)
  .post(productGroupsController.store);

router
  .route("/:id")
  .get(productGroupsController.show)
  .put(productGroupsController.update);

export default router;
