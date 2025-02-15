import { eq, and, ilike, or, SQL } from "drizzle-orm";
import { person } from "../../db/schema";
import { numbersOnly } from "../helpers/string_helper";
import Database from "../config/database";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

class PeopleService {
  private db: NodePgDatabase;
  constructor() {
    this.db = Database.getInstance();
  }

  getPeople = async (filters: Record<string, any> = {}) => {
    const where: (SQL | undefined)[] = [];
    const { search } = filters;

    if (search) {
      where.push(
        or(
          ilike(person.company_name, `%${search}%`),
          ilike(person.trading_name, `%${search}%`),

          numbersOnly(String(search)) !== ""
            ? ilike(person.cpf_cnpj, `%${numbersOnly(String(search))}%`)
            : undefined
        )
      );
    }

    const rows = await this.db
      .select({
        id: person.id,
        company_name: person.company_name,
        trading_name: person.trading_name,
        cpf_cnpj: person.cpf_cnpj,
        contact_type: person.contact_type,
      })
      .from(person)
      .where(and(...where))
      .orderBy(person.company_name);

    return rows;
  };

  createPerson = async (body: any) => {
    const { cpf_cnpj, zip_code } = body;

    const [row] = await this.db
      .insert(person)
      .values({
        company_name: body.company_name,
        trading_name: body.trading_name,
        cpf_cnpj: cpf_cnpj ? numbersOnly(cpf_cnpj) : null,
        contact_type: body.contact_type || ["CLIENTE"],

        zip_code: zip_code ? numbersOnly(zip_code) : null,
        address: body.address,
        neighbourhood: body.neighbourhood,
        city: body.city,
        ibge_code: body.ibge_code,
        number: body.number,
        complement: body.complement,
      })
      .returning();

    return row;
  };

  showPerson = async (id: number) => {
    const [row] = await this.db.select().from(person).where(eq(person.id, id));

    return row;
  };

  updatePerson = async (id: number, body: any) => {
    const { cpf_cnpj, zip_code } = body;

    const [row] = await this.db
      .update(person)
      .set({
        company_name: body.company_name,
        trading_name: body.trading_name,
        cpf_cnpj: cpf_cnpj ? numbersOnly(cpf_cnpj) : null,
        contact_type: body.contact_type || ["CLIENTE"],

        zip_code: zip_code ? numbersOnly(zip_code) : null,
        address: body.address,
        neighbourhood: body.neighbourhood,
        city: body.city,
        ibge_code: body.ibge_code,
        number: body.number,
        complement: body.complement,
      })
      .where(eq(person.id, id))
      .returning();

    return row;
  };

  deletePerson = async (id: number) => {
    const [row] = await this.db
      .delete(person)
      .where(eq(person.id, id))
      .returning();

    return row;
  };
}

export default new PeopleService();
