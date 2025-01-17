import { eq } from "drizzle-orm";
import { product } from "../../db/schema";
import Database from "../config/database";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

class ProductsValidator {
  private db: NodePgDatabase;
  constructor() {
    this.db = Database.getInstance();
  }

  async isReferenceDuplicate(reference: string) {
    const isDuplicate = await this.db
      .select()
      .from(product)
      .where(eq(product.reference, reference));

    return isDuplicate.length > 0;
  }
}

export default new ProductsValidator();
