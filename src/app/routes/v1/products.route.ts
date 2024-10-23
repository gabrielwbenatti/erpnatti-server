import { Router } from "express";
import productController from "../../controllers/products.controller";

const router = Router();

router.route("/").get(productController.index).post(productController.store);

router
  .route("/:id")
  .get(productController.show)
  .put(productController.update)
  .delete(productController.remove);

export default router;
