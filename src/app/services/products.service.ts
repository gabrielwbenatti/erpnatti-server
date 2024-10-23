import { product } from "../../db/schema";
import { eq, and, SQL, asc, or, ilike } from "drizzle-orm";
import Database from "../config/database";

class ProductsService {
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

    const db = Database.getInstance();
    const rows = await db
      .select({
        id: product.id,
        name: product.name,
        barcode: product.barcode,
        reference: product.reference,
      })
      .from(product)
      .where(and(...where))
      .orderBy(asc(product.name));

    return rows;
  };

  createProduct = async (body: any) => {
    const db = Database.getInstance();
    const rows = await db
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

    return rows[0];
  };

  showProduct = async (id: number) => {
    const db = Database.getInstance();
    const rows = await db.select().from(product).where(eq(product.id, id));

    return rows[0];
  };

  updateProduct = async (id: number, body: any) => {
    const db = Database.getInstance();
    const rows = await db
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
    const db = Database.getInstance();
    const rows = await db.delete(product).where(eq(product.id, id)).returning();

    return rows[0];
  };
}

export default new ProductsService();
