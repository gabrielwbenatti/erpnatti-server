import { Router } from "express";

import productRoute from "./products.route";

const router = Router();

const defaultRoutes = [{ path: "/produtos", route: productRoute }];
export default router;
