import { NextFunction, Request, Response } from "express";
import productsService from "../services/products.service";
import { successResponse } from "../helpers/http_responses";
import productsValidator from "../validators/products.validator";
import { HttpStatusCode } from "../helpers/http_status_code";
import { ControllerInterface } from "../interfaces/controller.interface";
import {
  DuplicatedRecordError,
  MissingFieldError,
} from "../helpers/http_error";

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

  async store(req: Request, res: Response, next: NextFunction) {
    const body = req.body;
    const { name, reference } = body;

    try {
      if (!name || name === "") {
        throw new MissingFieldError("name");
      }

      if (reference) {
        const isDuplicate = await productsValidator.isReferenceDuplicate(
          reference
        );

        if (isDuplicate)
          throw new DuplicatedRecordError("product", "reference");
      }

      const result = await productsService.createProduct(body);

      if (result.id) {
        successResponse(res, result, HttpStatusCode.CREATED);
      }
    } catch (error) {
      return next(error);
    }
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
