import { eq, and, ilike, or, SQL } from "drizzle-orm";
import { pessoasTable } from "../../db/schema";
import { numbersOnly } from "../helpers/string_helper";
import Database from "../config/database";

class PeopleService {
  getPeople = async (filters: Record<string, any> = {}) => {
    const where: (SQL | undefined)[] = [];
    const { search } = filters;

    if (search) {
      where.push(
        or(
          ilike(pessoasTable.razao_social, `%${search}%`),
          ilike(pessoasTable.nome_fantasia, `%${search}%`),

          numbersOnly(String(search)) !== ""
            ? ilike(pessoasTable.cpf_cnpj, `%${numbersOnly(String(search))}%`)
            : undefined
        )
      );
    }

    const db = Database.getInstance();
    const result = await db
      .select({
        id: pessoasTable.id,
        razao_social: pessoasTable.razao_social,
        nome_fantasia: pessoasTable.nome_fantasia,
        cpf_cnpj: pessoasTable.cpf_cnpj,
        tipo_pessoa: pessoasTable.tipo_pessoa,
      })
      .from(pessoasTable)
      .where(and(...where));

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
        bairro: body.bairro,
        cidade: body.cidade,
        codigo_ibge: body.codigo_ibge,
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

    return result[0];
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
        bairro: body.bairro,
        cidade: body.cidade,
        codigo_ibge: body.codigo_ibge,
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
