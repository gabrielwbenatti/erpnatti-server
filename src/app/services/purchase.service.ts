import db from "./database";

class PurchaseService {
  createPurchase = async (body: any) => {
    const result = await db.compras.create({
      data: {
        pessoa_id: body.pessoa.id,
        valor_outros: body.valor_outros || 0.0,
        valor_produto: body.valor_produto || 0.0,
        valor_total: body.valor_total || 0.0,
        data_emissao: new Date(body.data_emissao),
        data_entrada: new Date(body.data_entrada),
      },
    });

    return result;
  };

  showPurchase = async (id: number) => {
    const result = await db.compras.findFirst({
      where: { id: id },
      include: {
        pessoa: {
          select: { razao_social: true, nome_fantasia: true, cpf_cnpj: true },
        },
      },
    });

    return result;
  };
}

export default new PurchaseService();
