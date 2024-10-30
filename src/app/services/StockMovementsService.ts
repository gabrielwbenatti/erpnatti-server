import { NodePgDatabase } from "drizzle-orm/node-postgres";
import Database from "../config/Database";
import { stockMovement } from "../../db/schema";
import productsServices from "./ProductsServices";
class StockMovementsService {
  private db: NodePgDatabase;
  constructor() {
    this.db = Database.getInstance();
  }

  async store(
    product_id: number,
    quantity: number,
    date: Date,
    observation: string
  ) {
    const rows = await this.db
      .insert(stockMovement)
      .values({
        product_id: product_id,
        date: date,
        observation: observation,
        quantity: quantity,
      })
      .returning();

    if (rows.length > 0) {
      await productsServices.updateStock(product_id, quantity);
    }

    return rows[0];
  }
}

export default new StockMovementsService();
