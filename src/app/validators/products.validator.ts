import { eq } from "drizzle-orm";
import { produto } from "../../db/schema";
import Database from "../config/database";

class ProductsValidator {
  isReferenceDuplicate = async (referencia: string) => {
    const db = Database.getInstance();
    const isDuplicate = await db
      .select()
      .from(produto)
      .where(eq(produto.referencia, referencia));

    return isDuplicate.length > 0;
  };
}

export default new ProductsValidator();
