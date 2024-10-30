import { Router } from "express";

import productRoute from "./ProductsRoutes";
import peopleRoute from "./PeopleRoutes";
import purchasesRoute from "./PurchasesRoutes";
import payablesRoute from "./PayablesRoutes";

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
];

defaultRoutes.forEach((defaultRoute) => {
  router.use(defaultRoute.path, defaultRoute.route);
});

export default router;
