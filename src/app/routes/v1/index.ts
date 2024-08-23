import { Router } from "express";

import productRoute from "./products.route";
import peopleRoute from "./people.route";

const router = Router();

const defaultRoutes = [
  { path: "/products", route: productRoute },
  { path: "/people", route: peopleRoute },
];

defaultRoutes.forEach((rout) => {
  router.use(rout.path, rout.route);
});

export default router;
