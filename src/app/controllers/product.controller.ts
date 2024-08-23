import { Request, Response } from "express";
import db from "../services/database";

const getProducts = async () => {
  const result = await db.produtos.findMany();
  console.log(result);
};

const createProduct = async (req: Request, res: Response) => {};

export { getProducts, createProduct };
