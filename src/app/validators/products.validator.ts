import { eq } from "drizzle-orm";
import { produtosTable } from "../../db/schema";
import Database from "../config/database";

class ProductsValidator {
  isReferenceDuplicate = async (referencia: string) => {
    const db = Database.getInstance();
    const isDuplicate = await db
      .select()
      .from(produtosTable)
      .where(eq(produtosTable.referencia, referencia));

    return isDuplicate.length > 0;
  };
}

export default new ProductsValidator();
