import { product } from "../../db/schema";
import { eq, and, SQL, asc, or, ilike, sql } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import Database from "../config/Database";
import StockMovementsService from "./StockMovementsService";

class ProductsService {
  private db: NodePgDatabase;
  constructor() {
    this.db = Database.getInstance();
  }

  getProducts = async (filters: Record<string, any> = {}) => {
    const { search } = filters;
    const where: (SQL | undefined)[] = [];

    if (search) {
      where.push(
        or(
          ilike(product.name, `%${search}%`),
          ilike(product.reference, `%${search}%`)
        )
      );
    }

    const rows = await this.db
      .select({
        id: product.id,
        name: product.name,
        barcode: product.barcode,
        reference: product.reference,
        current_stock: product.current_stock,
      })
      .from(product)
      .where(and(...where))
      .orderBy(asc(product.name));

    return rows;
  };

  createProduct = async (body: any) => {
    const rows = await this.db
      .insert(product)
      .values({
        name: body.name,
        reference: body.reference,
        barcode: body.barcode,
        move_stock: body.move_stock,
        status: body.status,
        minimum_stock: body.minimum_stock,
        maximum_stock: body.maximum_stock,
        current_stock: body.current_stock,
        product_group_id: body.product_group_id,
        product_line_id: body.product_line_id,
      })
      .returning();

    // Registra a movimentação inicial de estoque
    if (rows.length > 0 && rows[0].id) {
      const { id, current_stock } = rows[0];
      if (current_stock) {
        await StockMovementsService.store(
          id,
          current_stock,
          new Date(),
          "Initial Stock"
        );
      }
    }

    return rows[0];
  };

  showProduct = async (id: number) => {
    const rows = await this.db.select().from(product).where(eq(product.id, id));

    return rows[0];
  };

  updateProduct = async (id: number, body: any) => {
    const rows = await this.db
      .update(product)
      .set({
        name: body.name,
        reference: body.reference,
        barcode: body.barcode,
        move_stock: body.move_stock,
        minimum_stock: body.minimum_stock,
        maximum_stock: body.maximum_stock,
        current_stock: body.current_stock,
        product_group_id: body.product_group_id,
        product_line_id: body.product_line_id,
      })
      .where(eq(product.id, id))
      .returning();

    return rows[0];
  };

  deleteProduct = async (id: number) => {
    const rows = await this.db
      .delete(product)
      .where(eq(product.id, id))
      .returning();

    return rows[0];
  };

  async updateStock(id: number, quantity: number) {
    const rows = await this.db
      .update(product)
      .set({
        current_stock: sql`${product.current_stock} + ${quantity}`,
      })
      .where(and(eq(product.id, id), eq(product.move_stock, true)))
      .returning();

    return rows[0];
  }
}

export default new ProductsService();
