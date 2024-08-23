import { Router } from "express";
import personController from "../../controllers/person.controller";

const router = Router();

router
  .route("/")
  .get(personController.getPeople)
  .post(personController.createPerson);

router
  .route("/:id")
  .get(personController.showPerson)
  .delete(personController.deletePerson);

export default router;
