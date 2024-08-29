import { Prisma } from "@prisma/client";
import db from "../config/database";

class ProductsService {
  getProducts = async (
    query: Prisma.produtoWhereInput | undefined = undefined
  ) => {
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
    const result = await db.produto.findMany({
      where: query,
    });

    return result;
  };

  createProduct = async (body: any) => {
    const result = await db.produto.create({
      data: {
        nome: body.nome,
        codigo_barra: body.codigo_barra,
        movimenta_estoque: body.movimenta_estoque,
        estoque_minimo: body.estoque_minimo,
        estoque_maximo: body.estoque_maximo,
        grupo_produto_id: body.grupo_produto?.id || null,
      },
    });

    return result;
  };

  showProduct = async (id: number) => {
    const product = await db.produto.findFirst({ where: { id: id } });

    return product;
  };

  updateProduct = async (body: any) => {
    const result = await db.produto.update({
      data: {
        nome: body.nome,
        codigo_barra: body.codigo_barra,
        movimenta_estoque: body.movimenta_estoque,
        estoque_minimo: body.estoque_minimo,
        estoque_maximo: body.estoque_maximo,
        grupo_produto_id: body.grupo_produto?.id || null,
      },
      where: { id: body.id },
    });

    return result;
  };

  deleteProduct = async (id: number) => {
    const product = await db.produto.delete({ where: { id: id } });

    return product;
  };
}

export default new ProductsService();
