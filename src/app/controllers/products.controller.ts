import { Request, Response } from "express";
import productsService from "../services/products.service";

class ProductsController {
  getProducts = async (_: Request, res: Response) => {
    const result = await productsService.getProducts();

    res.send(result);
  };

  createProduct = async (req: Request, res: Response) => {
    const body = req.body;
    const product = await productsService.createProduct(body);

    res.send(product);
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
