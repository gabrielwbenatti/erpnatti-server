import { Router } from "express";

import productRoute from "./ProductsRoutes";
import peopleRoute from "./PeopleRoutes";
import purchasesRoute from "./PurchasesRoutes";
import payablesRoute from "./PayablesRoutes";
import stockMovementsRoute from "./StockMovementsRoutes";

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
  { path: "/stock_movements", route: stockMovementsRoute },
];

defaultRoutes.forEach((defaultRoute) => {
  router.use(defaultRoute.path, defaultRoute.route);
});

export default router;
