import { eq, SQL } from "drizzle-orm";
import { pessoasTable } from "../../db/schema";
import db from "../config/database";
import { numbersOnly } from "../helpers/string_helper";
import Database from "../config/database";

class PeopleService {
  getPeople = async (where: SQL | undefined) => {
    const db = Database.getInstance();
    const result = await db.select().from(pessoasTable);

    return result;
  };

  createPerson = async (body: any) => {
    const db = Database.getInstance();
    const { cpf_cnpj, cep } = body;

    const result = await db
      .insert(pessoasTable)
      .values({
        razao_social: body.razao_social,
        nome_fantasia: body.nome_fantasia,
        cpf_cnpj: numbersOnly(cpf_cnpj),
        tipo_pessoa: body.tipo_pessoa || ["CLIENTE"],
        endereco: body.endereco,
        numero: body.numero,
        complemento: body.complemento,
        cep: numbersOnly(cep),
      })
      .returning();

    return result;
  };

  showPerson = async (id: number) => {
    const db = Database.getInstance();
    const result = await db
      .select()
      .from(pessoasTable)
      .where(eq(pessoasTable.id, id));

    return result;
  };

  updatePerson = async (id: number, body: any) => {
    const db = Database.getInstance();
    const { cpf_cnpj, cep } = body;

    const result = await db
      .update(pessoasTable)
      .set({
        razao_social: body.razao_social,
        nome_fantasia: body.nome_fantasia,
        cpf_cnpj: numbersOnly(cpf_cnpj),
        tipo_pessoa: body.tipo_pessoa,
        endereco: body.endereco,
        numero: body.numero,
        complemento: body.complemento,
        cep: numbersOnly(cep),
      })
      .where(eq(pessoasTable.id, id))
      .returning();

    return result;
  };

  deletePerson = async (id: number) => {
    const db = Database.getInstance();

    const person = await db
      .delete(pessoasTable)
      .where(eq(pessoasTable.id, id))
      .returning();

    return person;
  };
}

export default new PeopleService();
