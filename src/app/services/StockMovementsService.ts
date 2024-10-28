import { NodePgDatabase } from "drizzle-orm/node-postgres";
import Database from "../config/Database";
import { product, stockMovement } from "../../db/schema";

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
    const row = await this.db
      .insert(stockMovement)
      .values({
        product_id: product_id,
        date: date,
        observation: observation,
        quantity: quantity,
      })
      .returning();

    return row[0];
  }
}

export default new StockMovementsService();
