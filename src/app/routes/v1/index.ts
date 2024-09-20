import { Router } from "express";

import productRoute from "./products.route";
import peopleRoute from "./people.route";
import purchasesRoute from "./purchases.route";
import salesRoute from "./sales.route";

const router = Router();

const defaultRoutes = [
  { path: "/products", route: productRoute },
  { path: "/people", route: peopleRoute },
  { path: "/purchases", route: purchasesRoute },
  { path: "/sales", route: salesRoute },
];

defaultRoutes.forEach((e) => {
  router.use(e.path, e.route);
});

export default router;
