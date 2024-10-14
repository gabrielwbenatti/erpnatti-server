import { eq } from "drizzle-orm";
import { pessoasTable } from "../../db/schema";
import db from "../config/database";
import { numbersOnly } from "../helpers/string_helper";

class PeopleService {
  getPeople = async () => {
    const result = (await db).select().from(pessoasTable);

    return result;
  };

  createPerson = async (body: any) => {
    const { cpf_cnpj, cep } = body;

    const result = (await db)
      .insert(pessoasTable)
      .values({
        razao_social: body.razao_social,
        nome_fantasia: body.nome_fantasia,
        cpf_cnpj: numbersOnly(cpf_cnpj),
        tipo_pessoa: body.tipo_pessoa || ["CLI"],
        endereco: body.endereco,
        numero: body.numero,
        complemento: body.complemento,
        cep: numbersOnly(cep),
      })
      .returning();

    return result;
  };

  showPerson = async (id: number) => {
    const result = (await db)
      .select()
      .from(pessoasTable)
      .where(eq(pessoasTable.id, id));

    return result;
  };

  updatePerson = async (id: number, body: any) => {
    const { cpf_cnpj, cep } = body;

    const result = (await db)
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
    const person = (await db)
      .delete(pessoasTable)
      .where(eq(pessoasTable.id, id))
      .returning();

    return person;
  };
}

export default new PeopleService();
