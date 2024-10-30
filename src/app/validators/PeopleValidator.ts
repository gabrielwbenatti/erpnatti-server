import { eq } from "drizzle-orm";
import { person } from "../../db/schema";
import Database from "../config/Database";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

class PeopleValidator {
  private db: NodePgDatabase;
  constructor() {
    this.db = Database.getInstance();
  }

  isDuplicatedPerson = async (cpf_cnpj: string) => {
    const duplicatedPerson = await this.db
      .select()
      .from(person)
      .where(eq(person.cpf_cnpj, cpf_cnpj));

    return duplicatedPerson.length > 0;
  };
}

export default new PeopleValidator();
