import { Request, Response } from "express";
import productsService from "../services/products.service";
import { successResponse } from "../helpers/http_responses";
import productsValidator from "../validators/products.validator";
import { HttpStatusCode } from "../helpers/http_status_code";
import { ControllerInterface } from "../interfaces/controller.interface";

class ProductsController implements ControllerInterface {
  async index(req: Request, res: Response) {
    const { search, referencia } = req.query;

    const result = await productsService.getProducts({ search, referencia });

    if (result) {
      successResponse(res, result, HttpStatusCode.OK, {
        count: result.length,
      });
    }
  }

  async store(req: Request, res: Response) {
    const body = req.body;
    const { referencia } = body;

    if (referencia) {
      const isDuplicate = await productsValidator.isReferenceDuplicate(
        referencia
      );

      if (isDuplicate)
        res
          .status(HttpStatusCode.CONFLICT)
          .json({ message: "Duplicate product" });
      return;
    }

    const result = await productsService.createProduct(body);

    if (result) successResponse(res, result, HttpStatusCode.CREATED);
  }

  async show(req: Request, res: Response) {
    const id = req.params.id;
    const product = await productsService.showProduct(+id);

    if (product) {
      successResponse(res, product, HttpStatusCode.OK);
    }
  }

  async update(req: Request, res: Response) {
    const body = req.body;
    const id = req.params.id;
    const product = await productsService.updateProduct(+id, body);

    if (product) {
      successResponse(res, product, HttpStatusCode.OK);
    }
  }

  async remove(req: Request, res: Response) {
    const id = req.params.id;
    const product = await productsService.deleteProduct(+id);
    if (product) {
      successResponse(res, product, HttpStatusCode.OK);
    }
  }
}

export default new ProductsController();
