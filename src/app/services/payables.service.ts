import { eq, and, SQL } from "drizzle-orm";
import Database from "../config/database";
import { contasPagarTable, pessoasTable } from "../../db/schema";

class PayablesService {
  getPayables = async (filters: (SQL | undefined)[] = []) => {
    const db = Database.getInstance();
    const rows = await db
      .select({
        id: contasPagarTable.id,
        numero_titulo: contasPagarTable.numero_titulo,
        valor: contasPagarTable.valor,
        data_vencimento: contasPagarTable.data_vencimento,
        data_emissao: contasPagarTable.data_emissao,
        numero_parcela: contasPagarTable.numero_parcela,
        pessoa_id: contasPagarTable.pessoa_id,
        razao_social: pessoasTable.razao_social,
        nome_fantasia: pessoasTable.nome_fantasia,
      })
      .from(contasPagarTable)
      .innerJoin(pessoasTable, eq(contasPagarTable.pessoa_id, pessoasTable.id))
      .where(and(...filters));

    return rows;
  };

  createPayable = async (body: any) => {
    const db = Database.getInstance();
    const { data_emissao, data_vencimento } = body;

    const row = await db
      .insert(contasPagarTable)
      .values({
        data_vencimento: new Date(data_vencimento),
        data_emissao: new Date(data_emissao),
        numero_titulo: body.numero_titulo,
        pessoa_id: body.pessoa_id,
        compra_id: body.compra_id,
        numero_parcela: body.numero_parcela,
        valor: body.valor,
      })
      .returning();

    return row[0];
  };

  show = async (id: number) => {
    const db = Database.getInstance();

    const rows = await db
      .select()
      .from(contasPagarTable)
      .where(eq(contasPagarTable.id, id));

    return rows[0];
  };

  update = async (id: number, body: any) => {};

  remove = async (id: number) => {};
}

export default new PayablesService();
