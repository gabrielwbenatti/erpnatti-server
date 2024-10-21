import { eq, and, SQL } from "drizzle-orm";
import Database from "../config/database";
import { contasPagarTable, pessoasTable } from "../../db/schema";

class PayablesService {
  getPayables = async (filters: Record<string, any> = {}) => {
    const {} = filters;
    const where: (SQL | undefined)[] = [];

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
      .where(and(...where));

    return rows;
  };

  createPayable = async (body: any[]) => {
    const db = Database.getInstance();
    const rows: any[] = [];

    await db.transaction(async (tx) => {
      body.map(async (payable: any) => {
        const { data_emissao, data_vencimento } = payable;

        const row = await tx
          .insert(contasPagarTable)
          .values({
            data_vencimento: new Date(data_vencimento),
            data_emissao: new Date(data_emissao),
            numero_titulo: payable.numero_titulo,
            pessoa_id: payable.pessoa_id,
            compra_id: payable.compra_id,
            numero_parcela: payable.numero_parcela,
            valor: payable.valor,
          })
          .returning();

        rows.push(row[0]);
      });
    });

    return rows;
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

  remove = async (id: number) => {
    const db = Database.getInstance();

    const rows = await db
      .delete(contasPagarTable)
      .where(eq(contasPagarTable.id, id))
      .returning();

    return rows[0];
  };
}

export default new PayablesService();
