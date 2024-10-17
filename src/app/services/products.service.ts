import { produtosTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import Database from "../config/database";

class ProductsService {
  getProducts = async () => {
    //     const result = await db.$queryRaw`WITH ultima_compra AS (
    //          SELECT ci.produto_id,
    //             ci.valor_unitario,
    //             c.data_emissao,
    //             row_number() OVER (PARTITION BY ci.produto_id ORDER BY c.data_emissao DESC) AS row_no
    //            FROM compras_itens ci
    //              JOIN compras c ON c.id = ci.compra_id
    //           ORDER BY c.data_emissao DESC
    //         )
    //  SELECT p.id,
    //     p.nome,
    //     p.codigo_barra,
    //     p.movimenta_estoque,
    //     p.estoque_minimo,
    //     p.estoque_maximo,
    //     p.grupo_produto_id,
    //     uc.valor_unitario AS valor_ultima_compra,
    //     uc.data_emissao AS data_ultima_compra
    //    FROM produtos p
    //      LEFT JOIN ultima_compra uc ON uc.produto_id = p.id AND uc.row_no = 1;`;
    const db = Database.getInstance();

    const result = await db
      .select({
        id: produtosTable.id,
        nome: produtosTable.nome,
        codigo_barra: produtosTable.codigo_barra,
        referencia: produtosTable.referencia,
      })
      .from(produtosTable)
      .orderBy(produtosTable.nome);

    return result;
  };

  createProduct = async (body: any) => {
    const db = Database.getInstance();

    const result = await db
      .insert(produtosTable)
      .values({
        nome: body.nome,
        referencia: body.referencia,
        codigo_barra: body.codigo_barra,
        movimenta_estoque: body.movimenta_estoque,
        estoque_minimo: body.estoque_minimo,
        estoque_maximo: body.estoque_maximo,
        grupo_produto_id: body.grupo_produto_id,
        linha_produto_id: body.linha_produto_id,
      })
      .returning();

    return result;
  };

  showProduct = async (id: number) => {
    const db = Database.getInstance();

    const product = await db
      .select()
      .from(produtosTable)
      .where(eq(produtosTable.id, id));

    return product[0];
  };

  updateProduct = async (id: number, body: any) => {
    const db = Database.getInstance();

    const result = await db
      .update(produtosTable)
      .set({
        nome: body.nome,
        referencia: body.referencia,
        codigo_barra: body.codigo_barra,
        movimenta_estoque: body.movimenta_estoque,
        estoque_minimo: body.estoque_minimo,
        estoque_maximo: body.estoque_maximo,
        grupo_produto_id: body.grupo_produto_id,
        linha_produto_id: body.linha_produto_id,
      })
      .where(eq(produtosTable.id, id))
      .returning();

    return result;
  };

  deleteProduct = async (id: number) => {
    const db = Database.getInstance();

    const product = await db
      .delete(produtosTable)
      .where(eq(produtosTable.id, id))
      .returning();

    return product;
  };
}

export default new ProductsService();
