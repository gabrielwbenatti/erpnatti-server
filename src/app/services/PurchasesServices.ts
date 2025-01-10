import { and, eq, SQL } from "drizzle-orm";
import {
  purchaseItem,
  purchase,
  person,
  product,
  payable,
} from "../../db/schema";
import Database from "../config/database";
import stockMovementsService from "./StockMovementsService";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { HttpError } from "../helpers/http_error";

class PurchasesService {
  private db: NodePgDatabase;
  constructor() {
    this.db = Database.getInstance();
  }

  getPurchases = async (filters: Record<string, any> = {}) => {
    const {} = filters;
    const where: (SQL | undefined)[] = [];

    const rows = await this.db
      .select({
        id: purchase.id,
        emission_date: purchase.emission_date,
        entry_date: purchase.entry_date,
        product_amount: purchase.product_amount,
        document_number: purchase.document_number,
        document_series: purchase.document_series,
        total_amount: purchase.total_amount,

        person_id: purchase.person_id,
        supplier: {
          company_name: person.company_name,
          trading_name: person.trading_name,
          cpf_cnpj: person.cpf_cnpj,
        },
      })
      .from(purchase)
      .innerJoin(person, eq(purchase.person_id, person.id))
      .where(and(...where));

    return rows;
  };

  createPurchase = async (body: any) => {
    const { entry_date, emission_date, items, payables } = body;

    await this.db.transaction(async (trx) => {
      const [purchase_row] = await trx
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

      const purchase_id = purchase_row.id;

      if (purchase_id && items) {
        const itemsData = items.map((item: any) => ({
          purchase_id: purchase_id,
          product_id: item.product_id,
          quantity: item.quantity,
          unitary_amount: item.unitary_amount,
          total_amount: item.total_amount,
          observation: item.observation,
        }));

        await trx.insert(purchaseItem).values(itemsData);
      }

      if (purchase_id && payables) {
        const payablesData = payables.map((item: any) => ({}));
      }
    });

    return null;
  };

  showPurchase = async (id: number) => {
    const purchase_rows = await this.db
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
        fournisseur: {
          company_name: person.company_name,
          trading_name: person.trading_name,
          cpf_cnpj: person.cpf_cnpj,
        },
      })
      .from(purchase)
      .innerJoin(person, eq(purchase.person_id, person.id))
      .where(eq(purchase.id, id));

    const items_rows = await this.db
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

    const payables_rows = await this.db
      .select()
      .from(payable)
      .where(eq(payable.purchase_id, id));

    return { ...purchase_rows[0], items: items_rows, payables: payables_rows };
  };

  updatePurchase = async (id: number, body: any) => {
    const { emission_date, entry_date, items } = body;
    const purchase_id = id;

    const result = await this.db
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
      await this.db.transaction(async (tx) => {
        await Promise.all(
          items.map(async (item: any) => {
            if (!item.id) {
              await this.db.insert(purchaseItem).values({
                purchase_id: purchase_id,
                product_id: item.product_id,
                quantity: item.quantity,
                unitary_amount: item.unitary_amount,
                total_amount: item.total_amount,
                observation: item.observation,
              });
            } else {
              await this.db
                .update(purchaseItem)
                .set({
                  purchase_id: purchase_id,
                  product_id: item.product_id,
                  quantity: item.quantity,
                  unitary_amount: item.unitary_amount,
                  total_amount: item.total_amount,
                  observation: item.observation,
                })
                .where(
                  and(
                    eq(purchaseItem.purchase_id, purchase_id),
                    eq(purchaseItem.id, item.id)
                  )
                );
            }
          })
        );
      });
    }

    return result[0];
  };

  deletePurchase = async (id: number) => {
    const [row] = await this.db
      .delete(purchase)
      .where(eq(purchase.id, id))
      .returning();

    return row;
  };

  finishPurchase = async (id: number) => {
    // Obtém os dados da compra
    const { entry_date, items } = await this.showPurchase(id);

    if (!items || items.length === 0) {
      return [];
    }

    // Lista de promessas (Promises) a serem executadas
    const stockMovementsPromises = items.map((item) =>
      stockMovementsService.store(
        item.product_id,
        item.quantity!,
        new Date(entry_date),
        `Purchase Id ${id}`
      )
    );

    // Esperar todas as promessas serem resolvidas
    const rows = await Promise.all(stockMovementsPromises);

    return rows;
  };
}

export default new PurchasesService();
