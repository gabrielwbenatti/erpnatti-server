import { Router } from "express";

import productRoute from "./products.route";
import peopleRoute from "./people.route";
import purchasesRoute from "./purchases.route";
import payablesRoute from "./payable.route";
// import salesRoute from "./sales.route";

const router = Router();

interface DefaultRoutes {
  path: string;
  route: Router;
}

const defaultRoutes: DefaultRoutes[] = [
  { path: "/products", route: productRoute },
  { path: "/people", route: peopleRoute },
  { path: "/purchases", route: purchasesRoute },
  { path: "/payables", route: payablesRoute },
  // { path: "/sales", route: salesRoute },
];

defaultRoutes.forEach((defaultRoute) => {
  router.use(defaultRoute.path, defaultRoute.route);
});

export default router;
