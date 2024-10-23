import { Router } from "express";
import personController from "../../controllers/people.controller";

const router = Router();

router.route("/").get(personController.index).post(personController.store);

router
  .route("/:id")
  .get(personController.show)
  .put(personController.update)
  .delete(personController.remove);

export default router;
