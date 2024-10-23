import { eq, and, ilike, or, SQL } from "drizzle-orm";
import { person } from "../../db/schema";
import { numbersOnly } from "../helpers/string_helper";
import Database from "../config/database";

class PeopleService {
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

    const db = Database.getInstance();
    const rows = await db
      .select({
        id: person.id,
        company_name: person.company_name,
        trading_name: person.trading_name,
        cpf_cnpj: person.cpf_cnpj,
        person_type: person.person_type,
      })
      .from(person)
      .where(and(...where));

    return rows;
  };

  createPerson = async (body: any) => {
    const { cpf_cnpj, zip_code } = body;

    const db = Database.getInstance();
    const rows = await db
      .insert(person)
      .values({
        company_name: body.company_name,
        trading_name: body.trading_name,
        cpf_cnpj: numbersOnly(cpf_cnpj),
        person_type: body.person_type || ["CLIENTE"],

        zip_code: numbersOnly(zip_code),
        address: body.address,
        neighbourhood: body.neighbourhood,
        city: body.city,
        ibge_code: body.ibge_code,
        number: body.number,
        complement: body.complement,
      })
      .returning();

    return rows[0];
  };

  showPerson = async (id: number) => {
    const db = Database.getInstance();
    const result = await db.select().from(person).where(eq(person.id, id));

    return result[0];
  };

  updatePerson = async (id: number, body: any) => {
    const { cpf_cnpj, zip_code } = body;

    const db = Database.getInstance();
    const rows = await db
      .update(person)
      .set({
        company_name: body.company_name,
        trading_name: body.trading_name,
        cpf_cnpj: numbersOnly(cpf_cnpj),
        person_type: body.person_type || ["CLIENTE"],

        zip_code: numbersOnly(zip_code),
        address: body.address,
        neighbourhood: body.neighbourhood,
        city: body.city,
        ibge_code: body.ibge_code,
        number: body.number,
        complement: body.complement,
      })
      .where(eq(person.id, id))
      .returning();

    return rows[0];
  };

  deletePerson = async (id: number) => {
    const db = Database.getInstance();
    const rows = await db.delete(person).where(eq(person.id, id)).returning();

    return rows[0];
  };
}

export default new PeopleService();
