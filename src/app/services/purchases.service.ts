import { and, eq, SQL } from "drizzle-orm";
import {
  comprasItensTable,
  comprasTable,
  pessoasTable,
  produtosTable,
} from "../../db/schema";
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
        numero_documento: comprasTable.numero_documento,
        serie_documento: comprasTable.serie_documento,
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
    const { data_entrada, data_emissao, compras_itens } = body;

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

    if (result.length > 0 && compras_itens) {
      const compra_id = result[0].id;

      compras_itens.forEach(async (item: any) => {
        await db.insert(comprasItensTable).values({
          compra_id: compra_id,
          produto_id: item.produto_id,
          // descricao: item.descricao,
          quantidade: item.quantidade,
          valor_unitario: item.quantidade,
          valor_total: item.quantidade,
          observacao: item.quantidade,
        });
      });
    }

    return result[0];
  };

  showPurchase = async (id: number) => {
    const db = Database.getInstance();

    const result = await db
      .select({
        id: comprasTable.id,
        data_emissao: comprasTable.data_emissao,
        data_entrada: comprasTable.data_entrada,
        valor_produto: comprasTable.valor_produto,
        valor_frete: comprasTable.valor_frete,
        valor_outros: comprasTable.valor_outros,
        valor_total: comprasTable.valor_total,
        numero_documento: comprasTable.numero_documento,
        serie_documento: comprasTable.serie_documento,

        pessoa_id: comprasTable.pessoa_id,

        fornecedor: {
          razao_social: pessoasTable.razao_social,
          nome_fantasia: pessoasTable.nome_fantasia,
          cpf_cnpj: pessoasTable.cpf_cnpj,
        },
      })
      .from(comprasTable)
      .innerJoin(pessoasTable, eq(comprasTable.pessoa_id, pessoasTable.id))
      .where(eq(comprasTable.id, id));

    const items = await db
      .select({
        id: comprasItensTable.id,
        nome: produtosTable.nome,
        quantidade: comprasItensTable.quantidade,
        valor_unitario: comprasItensTable.valor_unitario,
        valor_total: comprasItensTable.valor_total,
        observacao: comprasItensTable.observacao,

        produto_id: comprasItensTable.produto_id,
        compra_id: comprasItensTable.compra_id,
      })
      .from(comprasItensTable)
      .innerJoin(
        produtosTable,
        eq(comprasItensTable.produto_id, produtosTable.id)
      )
      .where(eq(comprasItensTable.compra_id, id));

    return { ...result[0], compras_itens: items };
  };

  updatePurchase = async (id: number, body: any) => {
    const db = Database.getInstance();
    const { data_emissao, data_entrada, compras_itens } = body;

    const result = await db
      .update(comprasTable)
      .set({
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
      .where(eq(comprasTable.id, id))
      .returning();

    if (result.length > 0 && compras_itens) {
      compras_itens.forEach(async (item: any) => {
        const { compra_id, id } = item;

        await db
          .update(comprasItensTable)
          .set({
            compra_id: compra_id,
            produto_id: item.produto_id,
            // descricao: item.descricao,
            quantidade: item.quantidade,
            valor_unitario: item.quantidade,
            valor_total: item.quantidade,
            observacao: item.quantidade,
          })
          .where(
            and(
              eq(comprasItensTable.compra_id, compra_id),
              eq(comprasItensTable.id, id)
            )
          );
      });
    }

    return result[0];
  };
}

export default new PurchasesService();
