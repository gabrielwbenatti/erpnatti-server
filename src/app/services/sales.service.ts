import db from "../config/database";

class SalesService {
  getSales = async () => {
    const result = await db.venda.findMany({
      orderBy: { data_venda: "desc" },
    });

    return result;
  };

  createSales = async (body: any) => {
    const result = await db.venda.create({
      data: {
        pessoa_id: body.pessoa_id,
        valor_produto: body.valor_produto,
        valor_frete: body.valor_frete,
        valor_outros: body.valor_outros,
        valor_total: body.valor_total,
        data_venda: body.data_venda,
        data_entrega: body.data_entrega,
      },
    });

    return result;
  };

  showSales = async (id: number) => {
    const result = await db.venda.findFirst({ where: { id: id } });

    return result;
  };

  deleteSale = async (id: number) => {
    const result = await db.venda.delete({ where: { id: id } });

    return result;
  };
}

export default new SalesService();
