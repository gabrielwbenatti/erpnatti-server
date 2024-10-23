import { and, eq } from "drizzle-orm";
import { compra } from "../../db/schema";
import Database from "../config/database";

class PurchasesValidator {
  isPurchaseDuplicated = async (
    pessoa_id: string,
    numero_documento: string,
    serie_documento: string
  ) => {
    const db = Database.getInstance();

    const duplicatedPurchase = await db
      .select()
      .from(compra)
      .where(
        and(
          eq(compra.numero_documento, numero_documento),
          eq(compra.serie_documento, serie_documento),
          eq(compra.pessoa_id, +pessoa_id)
        )
      );

    return duplicatedPurchase.length > 0;
  };
}

export default new PurchasesValidator();
