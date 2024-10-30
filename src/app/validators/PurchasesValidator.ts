import { and, eq } from "drizzle-orm";
import { purchase } from "../../db/schema";
import Database from "../config/Database";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

class PurchasesValidator {
  private db: NodePgDatabase;
  constructor() {
    this.db = Database.getInstance();
  }

  isPurchaseDuplicated = async (
    pessoa_id: string,
    numero_documento: string,
    serie_documento: string
  ) => {
    const duplicatedPurchase = await this.db
      .select()
      .from(purchase)
      .where(
        and(
          eq(purchase.document_number, numero_documento),
          eq(purchase.document_series, serie_documento),
          eq(purchase.person_id, +pessoa_id)
        )
      );

    return duplicatedPurchase.length > 0;
  };
}

export default new PurchasesValidator();
