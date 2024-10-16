import { Request, Response } from "express";
import productsService from "../services/products.service";
import HttpStatusCode from "../helpers/http_status_code";
import { successResponse } from "../helpers/http_responses";
import productsValidator from "../validators/products.validator";

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
    const body = req.body;
    const { referencia } = body;

    if (referencia) {
      const isDuplicate = await productsValidator.isReferenceDuplicate(
        referencia
      );

      if (isDuplicate)
        return res
          .status(HttpStatusCode.CONFLICT)
          .json({ message: "Duplicate product" });
    }

    const result = await productsService.createProduct(body);

    if (result) {
      successResponse(res, result, HttpStatusCode.CREATED);
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
    const id = req.params.id;
    const product = await productsService.updateProduct(+id, body);

    if (product) {
      successResponse(res, product, HttpStatusCode.OK);
    }
  };

  deleteProduct = async (req: Request, res: Response) => {
    const id = req.params.id;
    const product = await productsService.deleteProduct(+id);
    if (product) {
      successResponse(res, product, HttpStatusCode.OK);
    }
  };
}

export default new ProductsController();
