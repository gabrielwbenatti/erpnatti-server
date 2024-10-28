import { NodePgDatabase } from "drizzle-orm/node-postgres";
import Database from "../config/Database";

class SalesService {
  private db: NodePgDatabase;
  constructor() {
    this.db = Database.getInstance();
  }

  getSales = async () => {
    const result = await this.db.venda.findMany({
      orderBy: { data_emissao: "desc" },
    });

    return result;
  };

  createSales = async (body: any) => {
    const { data_entrega } = body;

    const result = await this.db.venda.create({
      data: {
        pessoa_id: body.pessoa_id,
        valor_produto: body.valor_produto,
        valor_frete: body.valor_frete,
        valor_outros: body.valor_outros,
        valor_total: body.valor_total,
        data_emissao: body.data_emissao,
        data_entrega: data_entrega ? new Date(data_entrega) : null,
      },
    });

    return result;
  };

  showSales = async (id: number) => {
    const result = await this.db.venda.findFirst({ where: { id: id } });

    return result;
  };

  deleteSale = async (id: number) => {
    const result = await this.db.venda.delete({ where: { id: id } });

    return result;
  };
}

export default new SalesService();
