import { eq } from "drizzle-orm";
import { pessoa } from "../../db/schema";
import Database from "../config/database";

class PeopleValidator {
  isDuplicatedPerson = async (cpf_cnpj: string) => {
    const db = Database.getInstance();

    const duplicatedPerson = await db
      .select()
      .from(pessoa)
      .where(eq(pessoa.cpf_cnpj, cpf_cnpj));

    return duplicatedPerson.length > 0;
  };
}

export default new PeopleValidator();
