import { Prisma } from "@prisma/client";
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

    if (result) {
      const body_items = body.compras_itens;

      body_items.forEach((element: any) => {
        element.compra_id = result.id;
        element.produto_id = element.produto.id;

        delete element.produto;
      });

      await db.compras_itens.createMany({
        data: body_items,
      });
    }

    return result;
  };

  showPurchase = async (whereParams: Prisma.comprasWhereInput) => {
    const result = await db.compras.findFirst({
      where: whereParams,
      include: {
        compras_itens: {
          select: { produto: { select: { id: true, nome: true } } },
        },
        pessoa: {
          select: {
            id: true,
            razao_social: true,
            nome_fantasia: true,
            cpf_cnpj: true,
          },
        },
      },
    });

    return result;
  };
}

export default new PurchasesService();
