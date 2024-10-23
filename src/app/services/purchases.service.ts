import { and, eq, SQL } from "drizzle-orm";
import { compraItem, compra, pessoa, produto } from "../../db/schema";
import Database from "../config/database";

class PurchasesService {
  getPurchases = async (filters: Record<string, any> = {}) => {
    const {} = filters;
    const where: (SQL | undefined)[] = [];

    const db = Database.getInstance();
    const result = await db
      .select({
        id: compra.id,
        pessoa_id: compra.id,
        data_emissao: compra.data_emissao,
        data_entrada: compra.data_entrada,
        valor_produto: compra.valor_produto,
        numero_documento: compra.numero_documento,
        serie_documento: compra.serie_documento,
        valor_total: compra.valor_total,
        razao_social: pessoa.razao_social,
      })
      .from(compra)
      .innerJoin(pessoa, eq(compra.pessoa_id, pessoa.id))
      .where(and(...where));

    return result;
  };

  createPurchase = async (body: any) => {
    const db = Database.getInstance();
    const { data_entrada, data_emissao, compras_itens } = body;

    const result = await db
      .insert(compra)
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

      await db.transaction(async (tx) => {
        compras_itens.map(async (item: any) => {
          await tx.insert(compraItem).values({
            compra_id: compra_id,
            produto_id: item.produto_id,
            // descricao: item.descricao,
            quantidade: item.quantidade,
            valor_unitario: item.quantidade,
            valor_total: item.quantidade,
            observacao: item.quantidade,
          });
        });
      });
    }

    return result[0];
  };

  showPurchase = async (id: number) => {
    const db = Database.getInstance();

    const result = await db
      .select({
        id: compra.id,
        data_emissao: compra.data_emissao,
        data_entrada: compra.data_entrada,
        valor_produto: compra.valor_produto,
        valor_frete: compra.valor_frete,
        valor_outros: compra.valor_outros,
        valor_total: compra.valor_total,
        numero_documento: compra.numero_documento,
        serie_documento: compra.serie_documento,

        pessoa_id: compra.pessoa_id,

        fornecedor: {
          razao_social: pessoa.razao_social,
          nome_fantasia: pessoa.nome_fantasia,
          cpf_cnpj: pessoa.cpf_cnpj,
        },
      })
      .from(compra)
      .innerJoin(pessoa, eq(compra.pessoa_id, pessoa.id))
      .where(eq(compra.id, id));

    const items = await db
      .select({
        id: compraItem.id,
        nome: produto.nome,
        quantidade: compraItem.quantidade,
        valor_unitario: compraItem.valor_unitario,
        valor_total: compraItem.valor_total,
        observacao: compraItem.observacao,

        produto_id: compraItem.produto_id,
        compra_id: compraItem.compra_id,
      })
      .from(compraItem)
      .innerJoin(produto, eq(compraItem.produto_id, produto.id))
      .where(eq(compraItem.compra_id, id));

    return { ...result[0], compras_itens: items };
  };

  updatePurchase = async (id: number, body: any) => {
    const db = Database.getInstance();
    const { data_emissao, data_entrada, compras_itens } = body;

    const result = await db
      .update(compra)
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
      .where(eq(compra.id, id))
      .returning();

    if (result.length > 0 && compras_itens) {
      compras_itens.forEach(async (item: any) => {
        const { compra_id, id } = item;

        await db
          .update(compraItem)
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
            and(eq(compraItem.compra_id, compra_id), eq(compraItem.id, id))
          );
      });
    }

    return result[0];
  };
}

export default new PurchasesService();
