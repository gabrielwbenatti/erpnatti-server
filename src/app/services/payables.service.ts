import { eq, and, SQL } from "drizzle-orm";
import Database from "../config/database";
import { contaPagamento, contaPagar, pessoa } from "../../db/schema";

class PayablesService {
  getPayables = async (filters: Record<string, any> = {}) => {
    const {} = filters;
    const where: (SQL | undefined)[] = [];

    const db = Database.getInstance();
    const rows = await db
      .select({
        id: contaPagar.id,
        numero_titulo: contaPagar.numero_titulo,
        valor: contaPagar.valor,
        data_vencimento: contaPagar.data_vencimento,
        data_emissao: contaPagar.data_emissao,
        numero_parcela: contaPagar.numero_parcela,
        pessoa_id: contaPagar.pessoa_id,
        razao_social: pessoa.razao_social,
        nome_fantasia: pessoa.nome_fantasia,
      })
      .from(contaPagar)
      .innerJoin(pessoa, eq(contaPagar.pessoa_id, pessoa.id))
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
          .insert(contaPagar)
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
      .from(contaPagar)
      .where(eq(contaPagar.id, id));

    const payments = await db
      .select()
      .from(contaPagamento)
      .where(eq(contaPagamento.conta_pagar_id, id));

    return { ...rows[0], pagamentos: payments };
  };

  update = async (id: number, body: any) => {};

  remove = async (id: number) => {
    const db = Database.getInstance();

    const rows = await db
      .delete(contaPagar)
      .where(eq(contaPagar.id, id))
      .returning();

    return rows[0];
  };
}

export default new PayablesService();
