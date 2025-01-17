import { product, productGroup, productLine } from "../../db/schema";
import { eq, and, SQL, asc, or, ilike, sql } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import StockMovementsService from "./StockMovementsService";
import Database from "../config/database";

class ProductsService {
  private db: NodePgDatabase;
  constructor() {
    this.db = Database.getInstance();
  }

  getProducts = async (filters: Record<string, any> = {}) => {
    const { search, move_stock } = filters;
    const where: (SQL | undefined)[] = [];

    if (search) {
      where.push(
        or(
          ilike(product.name, `%${search}%`),
          ilike(product.reference, `%${search}%`)
        )
      );
    }
    if (move_stock) {
      where.push(and(product.move_stock, move_stock));
    }

    const rows = await this.db
      .select({
        id: product.id,
        name: product.name,
        barcode: product.barcode,
        reference: product.reference,
        current_stock: product.current_stock,
        group: { id: productGroup.id, name: productGroup.name },
        line: { id: productLine.id, name: productLine.name },
      })
      .from(product)
      .leftJoin(productGroup, eq(productGroup.id, product.product_group_id))
      .leftJoin(productLine, eq(productLine.id, product.product_line_id))
      .where(and(...where))
      .orderBy(asc(product.name));

    return rows;
  };

  createProduct = async (body: any) => {
    const [row] = await this.db
      .insert(product)
      .values({
        name: body.name,
        reference: body.reference,
        barcode: body.barcode,
        move_stock: body.move_stock,
        status: body.status,
        minimum_stock: body.minimum_stock,
        maximum_stock: body.maximum_stock,
        product_group_id: body.product_group_id,
        product_line_id: body.product_line_id,
      })
      .returning();

    // Registra a movimentação inicial de estoque
    if (row.id) {
      const { id } = row;
      if (body.current_stock) {
        await StockMovementsService.createMovement(
          id,
          body.current_stock,
          new Date(),
          "Initial Stock"
        );
      }
    }

    return row;
  };

  showProduct = async (id: number) => {
    const [row] = await this.db
      .select()
      .from(product)
      .where(eq(product.id, id));

    return row;
  };

  updateProduct = async (id: number, body: any) => {
    const [row] = await this.db
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

    return row;
  };

  deleteProduct = async (id: number) => {
    const [row] = await this.db
      .delete(product)
      .where(eq(product.id, id))
      .returning();

    return row;
  };

  async updateStock(id: number, quantity: number) {
    const [row] = await this.db
      .update(product)
      .set({
        current_stock: sql`${product.current_stock} + ${quantity}`,
      })
      .where(and(eq(product.id, id), eq(product.move_stock, true)))
      .returning();

    return row;
  }
}

export default new ProductsService();
