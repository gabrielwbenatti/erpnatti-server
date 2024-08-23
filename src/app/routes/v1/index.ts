import { Router } from "express";

import productRoute from "./products.route";

const router = Router();

const defaultRoutes = [{ path: "/products", route: productRoute }];

defaultRoutes.forEach((rout) => {
  router.use(rout.path, rout.route);
});

export default router;
