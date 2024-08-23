import { Router } from "express";

import productRoute from "./products.route";
import peopleRoute from "./people.route";
import purchasesRoute from "./purchases.route";

const router = Router();

const defaultRoutes = [
  { path: "/products", route: productRoute },
  { path: "/people", route: peopleRoute },
  { path: "/purchases", route: purchasesRoute },
];

defaultRoutes.forEach((rout) => {
  router.use(rout.path, rout.route);
});

export default router;
