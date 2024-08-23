import db from "./database";

class ProductsService {
  getProducts = async () => {
    const result = await db.produtos.findMany();
    return result;
  };

  createProduct = async (body: any) => {
    const result = await db.produtos.create({
      data: {
        nome: body.nome,
        codigo_barra: body.codigo_barra || "",
        movimenta_estoque: body.movimenta_estoque || true,
        estoque_minimo: body.estoque_minimo || 0.0,
        estoque_maximo: body.estoque_maximo || 0.0,
        grupo_produto_id: body.grupo_produto_id || null,
      },
    });

    return result;
  };
}

export default new ProductsService();
