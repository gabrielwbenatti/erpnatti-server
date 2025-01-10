import { NodePgDatabase } from "drizzle-orm/node-postgres";
import Database from "../config/database";
import { productLine } from "../../db/schema";
import { asc, eq } from "drizzle-orm";

class ProductLinesService {
  private db: NodePgDatabase;
  constructor() {
    this.db = Database.getInstance();
  }

  getLines = async () => {
    const rows = await this.db
      .select({
        id: productLine.id,
        name: productLine.name,
        status: productLine.status,
      })
      .from(productLine)
      .orderBy(asc(productLine.name));

    return rows;
  };

  createLine = async (body: any) => {
    const [row] = await this.db
      .insert(productLine)
      .values({
        name: body.name,
        status: body.status || true,
      })
      .returning();

    return row;
  };

  showLine = async (id: number) => {
    const [row] = await this.db
      .select()
      .from(productLine)
      .where(eq(productLine.id, id));

    return row;
  };

  updateLine = async (id: number, body: any) => {
    const [row] = await this.db
      .update(productLine)
      .set({
        name: body.name,
        status: body.status || true,
      })
      .returning();

    return row;
  };
}

export default new ProductLinesService();
