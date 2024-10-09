import { Request, Response } from "express";
import productsService from "../services/products.service";
import HttpStatusCode from "../helpers/http_status_code";
import { successResponse } from "../helpers/http_responses";

class ProductsController {
  getProducts = async (_: Request, res: Response) => {
    const result = await productsService.getProducts();

    if (result) {
      successResponse(res, result, HttpStatusCode.OK, {
        count: result.length,
      });
    }
  };

  createProduct = async (req: Request, res: Response) => {
    const body = Array.isArray(req.body) ? req.body : [req.body];

    const result = await productsService.createProduct(body);

    if (result) {
      successResponse(res, result, HttpStatusCode.CREATED, {
        count: result.length,
      });
    }
  };

  showProduct = async (req: Request, res: Response) => {
    const id = req.params.id;
    const product = await productsService.showProduct(+id);

    if (product) {
      successResponse(res, product, HttpStatusCode.OK);
    }
  };

  updateProduct = async (req: Request, res: Response) => {
    const body = req.body;
    const product = await productsService.updateProduct(body);

    if (product) {
      successResponse(res, product, HttpStatusCode.ACCEPTED);
    }
  };

  deleteProduct = async (req: Request, res: Response) => {
    const id = req.params.id;
    const product = await productsService.deleteProduct(+id);

    if (product) {
      successResponse(res, product, HttpStatusCode.ACCEPTED);
    }
  };
}

export default new ProductsController();
