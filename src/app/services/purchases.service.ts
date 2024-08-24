import db from "./database";

class PurchasesService {
  createPurchase = async (body: any) => {
    const result = await db.compras.create({
      data: {
        pessoa_id: body.pessoa.id,
        valor_outros: body.valor_outros,
        valor_produto: body.valor_produto,
        valor_total: body.valor_total,
        data_emissao: new Date(body.data_emissao),
        data_entrada: new Date(body.data_entrada),
        numero_documento: body.numero_documento,
        serie_documento: body.serie_documento,
      },
    });

    return result;
  };

  showPurchase = async (id: number) => {
    const result = await db.compras.findFirst({
      select: {
        id: true,
        pessoa: {
          select: { id: true, razao_social: true, nome_fantasia: true },
        },
        numero_documento: true,
        serie_documento: true,
        data_emissao: true,
        data_entrada: true,
        valor_produto: true,
        valor_outros: true,
        valor_total: true,
        compras_itens: true,
      },
      where: { id: id },
    });

    return result;
  };
}

export default new PurchasesService();
