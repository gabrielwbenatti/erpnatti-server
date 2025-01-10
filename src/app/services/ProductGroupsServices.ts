import { NodePgDatabase } from "drizzle-orm/node-postgres";
import Database from "../config/database";
import { productGroup } from "../../db/schema";
import { asc, eq } from "drizzle-orm";

class ProductGroupsService {
  private db: NodePgDatabase;
  constructor() {
    this.db = Database.getInstance();
  }

  getGroups = async () => {
    const rows = await this.db
      .select({
        id: productGroup.id,
        name: productGroup.name,
        status: productGroup.status,
      })
      .from(productGroup)
      .orderBy(asc(productGroup.name));

    return rows;
  };

  createGroup = async (body: any) => {
    const [row] = await this.db
      .insert(productGroup)
      .values({
        name: body.name,
        status: body.status || true,
      })
      .returning();

    return row;
  };

  showGroup = async (id: number) => {
    const [row] = await this.db
      .select()
      .from(productGroup)
      .where(eq(productGroup.id, id));

    return row;
  };

  updateGroup = async (id: number, body: any) => {
    const [row] = await this.db
      .update(productGroup)
      .set({
        name: body.name,
        status: body.status || true,
      })
      .where(eq(productGroup.id, id))
      .returning();

    return row;
  };
}

export default new ProductGroupsService();
