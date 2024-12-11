import { Router } from "express";
import productController from "../../controllers/ProductsController";

const router = Router();

router.route("/").get(productController.index).post(productController.store);

router
  .route("/:id")
  .get(productController.show)
  .put(productController.update)
  .delete(productController.remove);

// TODO: incorporar rotas de Stock Movements
// .get('/:id/stock-movements', showMovements)
// .post('/:id/stock-movements', createMovement)

export default router;
