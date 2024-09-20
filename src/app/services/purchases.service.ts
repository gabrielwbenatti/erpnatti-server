import { Prisma } from "@prisma/client";
import db from "../config/database";

class PurchasesService {
  getPurchases = async (params?: Prisma.compraWhereInput) => {
    const result = await db.compra.findMany({
      where: params,
      orderBy: { data_emissao: "desc" },
    });

    return result;
  };

  createPurchase = async (body: any) => {
    const result = await db.compra.create({
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

      await db.compra_item.createMany({
        data: body_items,
      });
    }

    return result;
  };

  showPurchase = async (id: number) => {
    const result = await db.compra.findFirst({
      where: { id: id },
      include: {
        compras_itens: {
          include: { produto: { select: { id: true, nome: true } } },
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
