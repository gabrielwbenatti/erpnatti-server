import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { stockMovement } from "../../db/schema";
import productsServices from "./ProductsServices";
import Database from "../config/database";
import { eq } from "drizzle-orm";

class StockMovementsService {
  private db: NodePgDatabase;
  constructor() {
    this.db = Database.getInstance();
  }

  async showMovements(product_id: number) {
    const rows = await this.db
      .select()
      .from(stockMovement)
      .where(eq(stockMovement.product_id, product_id))
      .orderBy(stockMovement.date);

    return rows;
  }

  async store(
    product_id: number,
    quantity: number,
    date: Date,
    observation: string
  ) {
    const [row] = await this.db
      .insert(stockMovement)
      .values({
        product_id: product_id,
        date: date,
        observation: observation,
        quantity: quantity,
      })
      .returning();

    if (row.id) {
      await productsServices.updateStock(product_id, quantity);
    }

    return row;
  }
}

export default new StockMovementsService();
