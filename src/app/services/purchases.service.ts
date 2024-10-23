import { and, eq, SQL } from "drizzle-orm";
import { purchaseItem, purchase, person, product } from "../../db/schema";
import Database from "../config/database";

class PurchasesService {
  getPurchases = async (filters: Record<string, any> = {}) => {
    const {} = filters;
    const where: (SQL | undefined)[] = [];

    const db = Database.getInstance();
    const rows = await db
      .select({
        id: purchase.id,
        pessoa_id: purchase.id,
        data_emissao: purchase.emission_date,
        data_entrada: purchase.entry_date,
        valor_produto: purchase.product_amount,
        numero_documento: purchase.document_number,
        serie_documento: purchase.document_series,
        valor_total: purchase.total_amount,
        razao_social: person.company_name,
        cpf_cnpj: person.cpf_cnpj,
      })
      .from(purchase)
      .innerJoin(person, eq(purchase.person_id, person.id))
      .where(and(...where));

    return rows;
  };

  createPurchase = async (body: any) => {
    const db = Database.getInstance();
    const { entry_date, emission_date, items } = body;

    const rows = await db
      .insert(purchase)
      .values({
        emission_date: new Date(emission_date),
        entry_date: new Date(entry_date),
        product_amount: body.product_amount,
        delivery_amount: body.delivery_amount,
        others_amount: body.others_amount,
        total_amount: body.total_amount,
        document_number: body.document_number,
        document_series: body.document_series,
        person_id: body.person_id,
      })
      .returning();

    if (rows.length > 0 && items) {
      const purchase_id = rows[0].id;

      await db.transaction(async (tx) => {
        items.map(async (item: any) => {
          await tx.insert(purchaseItem).values({
            purchase_id: purchase_id,
            product_id: item.product_id,
            // descricao: item.descricao,
            quantity: item.quantity,
            unitary_amount: item.unitary_amount,
            total_amount: item.total_amount,
            observation: item.observation,
          });
        });
      });
    }

    return rows[0];
  };

  showPurchase = async (id: number) => {
    const db = Database.getInstance();

    const purchase_rows = await db
      .select({
        id: purchase.id,
        emission_date: purchase.emission_date,
        entry_date: purchase.entry_date,
        product_amount: purchase.product_amount,
        delivery_amount: purchase.delivery_amount,
        others_amount: purchase.others_amount,
        total_amount: purchase.total_amount,
        document_number: purchase.document_number,
        document_series: purchase.document_series,

        person_id: purchase.person_id,

        supplier: {
          company_name: person.company_name,
          trading_name: person.trading_name,
          cpf_cnpj: person.cpf_cnpj,
        },
      })
      .from(purchase)
      .innerJoin(person, eq(purchase.person_id, person.id))
      .where(eq(purchase.id, id));

    const items_rows = await db
      .select({
        id: purchaseItem.id,
        name: product.name,
        quantity: purchaseItem.quantity,
        unitary_amount: purchaseItem.unitary_amount,
        total_amount: purchaseItem.total_amount,
        observation: purchaseItem.observation,

        product_id: purchaseItem.product_id,
        purchase_id: purchaseItem.purchase_id,
      })
      .from(purchaseItem)
      .innerJoin(product, eq(purchaseItem.product_id, product.id))
      .where(eq(purchaseItem.purchase_id, id));

    return { ...purchase_rows[0], items: items_rows };
  };

  updatePurchase = async (id: number, body: any) => {
    const db = Database.getInstance();
    const { emission_date, entry_date, items } = body;

    const result = await db
      .update(purchase)
      .set({
        emission_date: new Date(emission_date),
        entry_date: new Date(entry_date),
        product_amount: body.product_amount,
        delivery_amount: body.delivery_amount,
        others_amount: body.others_amount,
        total_amount: body.total_amount,
        document_number: body.document_number,
        document_series: body.document_series,
        person_id: body.person_id,
      })
      .where(eq(purchase.id, id))
      .returning();

    if (result.length > 0 && items) {
      items.forEach(async (item: any) => {
        const { purchase_id, id } = item;

        await db
          .update(purchaseItem)
          .set({
            purchase_id: purchase_id,
            product_id: item.product_id,
            // descricao: item.descricao,
            quantity: item.quantity,
            unitary_amount: item.unitary_amount,
            total_amount: item.total_amount,
            observation: item.observation,
          })
          .where(
            and(
              eq(purchaseItem.purchase_id, purchase_id),
              eq(purchaseItem.id, id)
            )
          );
      });
    }

    return result[0];
  };

  deletePurchase = async (id: number) => {
    const db = Database.getInstance();
    const rows = await db
      .delete(purchase)
      .where(eq(purchase.id, id))
      .returning();

    return rows[0];
  };
}

export default new PurchasesService();
