import { eq, and, SQL } from "drizzle-orm";
import Database from "../config/database";
import { payable, payments, person } from "../../db/schema";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

class PayablesService {
  private db: NodePgDatabase;
  constructor() {
    this.db = Database.getInstance();
  }

  getPayables = async (filters: Record<string, any> = {}) => {
    const {} = filters;
    const where: (SQL | undefined)[] = [];

    const rows = await this.db
      .select({
        id: payable.id,
        title_number: payable.title_number,
        amount: payable.amount,
        due_date: payable.due_date,
        emission_date: payable.emission_date,
        parcel_number: payable.parcel_number,
        person_id: payable.person_id,
        company_name: person.company_name,
        trading_name: person.trading_name,
      })
      .from(payable)
      .innerJoin(person, eq(payable.person_id, person.id))
      .where(and(...where));

    return rows;
  };

  createPayable = async (body: any[]) => {
    const rows: any[] = [];

    for (const item of body) {
      const { emission_date, due_date } = item;
      const [row] = await this.db
        .insert(payable)
        .values({
          due_date: new Date(due_date),
          emission_date: new Date(emission_date),
          person_id: item.person_id,
          title_number: item.title_number,
          amount: item.amount,
          parcel_number: item.parcel_number,
          purchase_id: item.purchase_id,
        })
        .returning();

      rows.push(row);
    }

    return rows;
  };

  showPayable = async (id: number) => {
    const [payable_row] = await this.db
      .select()
      .from(payable)
      .where(eq(payable.id, id));

    const payments_rows = await this.db
      .select()
      .from(payments)
      .where(eq(payments.payable_id, id));

    return { ...payable_row, payments: payments_rows };
  };

  updatePayable = async (id: number, body: any) => {
    const { emission_date, due_date } = body;

    const [row] = await this.db
      .update(payable)
      .set({
        due_date: new Date(due_date),
        emission_date: new Date(emission_date),
        person_id: body.person_id,
        title_number: body.title_number,
        amount: body.amount,
        parcel_number: body.parcel_number,
        purchase_id: body.purchase_id,
      })
      .where(eq(payable.id, id))
      .returning();

    return row;
  };

  removePayable = async (id: number) => {
    const [row] = await this.db
      .delete(payable)
      .where(eq(payable.id, id))
      .returning();

    return row;
  };
}

export default new PayablesService();
