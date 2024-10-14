import { eq, SQL } from "drizzle-orm";
import { comprasTable, pessoasTable } from "../../db/schema";
import db from "../config/database";
import Database from "../config/database";

class PurchasesService {
  getPurchases = async (where: SQL | undefined) => {
    const db = Database.getInstance();

    const result = await db
      .select({
        id: comprasTable.id,
        pessoa_id: comprasTable.id,
        data_emissao: comprasTable.data_emissao,
        data_entrada: comprasTable.data_entrada,
        valor_produto: comprasTable.valor_produto,
        valor_total: comprasTable.valor_total,
        razao_social: pessoasTable.razao_social,
      })
      .from(comprasTable)
      .innerJoin(pessoasTable, eq(comprasTable.pessoa_id, pessoasTable.id))
      .where(where);

    return result;
  };

  createPurchase = async (body: any) => {
    const db = Database.getInstance();
    const { data_entrada, data_emissao } = body;

    const result = await db
      .insert(comprasTable)
      .values({
        data_emissao: new Date(data_emissao),
        data_entrada: new Date(data_entrada),
        valor_produto: body.valor_produto,
        valor_frete: body.valor_frete,
        valor_outros: body.valor_outros,
        valor_total: body.valor_total,
        numero_documento: body.numero_documento,
        serie_documento: body.serie_documento,
        pessoa_id: body.pessoa_id,
      })
      .returning();

    // if (result && body.compras_itens) {
    //   const body_items = body.compras_itens;

    //   body_items.forEach((element: any) => {
    //     element.compra_id = result.id;
    //     element.produto_id = element.produto.id;

    //     delete element.produto;
    //   });

    //   await db.compra_item.createMany({
    //     data: body_items,
    //   });
    // }

    return result;
  };

  showPurchase = async (id: number) => {
    const db = Database.getInstance();

    const result = await db
      .select()
      .from(comprasTable)
      .innerJoin(pessoasTable, eq(comprasTable.pessoa_id, pessoasTable.id))
      .where(eq(comprasTable.id, id));

    console.log("res", result);
    return result;
  };
}

export default new PurchasesService();
