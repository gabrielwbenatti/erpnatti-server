import { Request, Response } from "express";
import productsService from "../services/products.service";
import HttpStatusCode from "../helpers/http_status_code";

class ProductsController {
  getProducts = async (req: Request, res: Response) => {
    const search = req.query.search?.toString();

    const result = search
      ? await productsService.getProducts({
          OR: [
            { nome: { contains: search, mode: "insensitive" } },
            { codigo_barra: { contains: search, mode: "insensitive" } },
          ],
        })
      : await productsService.getProducts();

    res.send(result);
  };

  createProduct = async (req: Request, res: Response) => {
    const body = req.body;
    const product = await productsService.createProduct(body);

    if (product) {
      res.status(HttpStatusCode.CREATED).send(product);
    }
  };

  showProduct = async (req: Request, res: Response) => {
    const id = req.params.id;
    const product = await productsService.showProduct(+id);

    res.send(product);
  };

  deleteProduct = async (req: Request, res: Response) => {
    const id = req.params.id;
    const product = await productsService.deleteProduct(+id);

    res.send(product);
  };
}

export default new ProductsController();
