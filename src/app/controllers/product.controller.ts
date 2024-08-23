import { Request, Response } from "express";
import productService from "../services/product.service";
import db from "../services/database";

class ProductController {
  getProducts = async (_: Request, res: Response) => {
    const result = await productService.getProducts();

    res.send(result);
  };

  createProduct = async (req: Request, res: Response) => {
    const body = req.body;
    const product = await productService.createProduct(body);

    res.send(product);
  };

  showProduct = async (req: Request, res: Response) => {
    const id = req.params.id;
    const product = await productService.showProduct(+id);

    res.send(product);
  };

  deleteProduct = async (req: Request, res: Response) => {
    const id = req.params.id;
    const product = await productService.deleteProduct(+id);

    res.send(product);
  };
}

export default new ProductController();
