import { Router } from "express";

import productRoute from "./ProductsRoutes";
import peopleRoute from "./PeopleRoutes";
import purchasesRoute from "./PurchasesRoutes";
import payablesRoute from "./PayablesRoutes";
import stockMovementsRoute from "./StockMovementsRoutes";
import productGroupsRoute from "./ProductGroupsRoute";
import productLinesRoute from "./ProductLinesGroup";

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
  { path: "/stock-movements", route: stockMovementsRoute },
  { path: "/product-groups", route: productGroupsRoute },
  { path: "/product-lines", route: productLinesRoute },
];

defaultRoutes.forEach((defaultRoute) => {
  router.use(defaultRoute.path, defaultRoute.route);
});

export default router;
