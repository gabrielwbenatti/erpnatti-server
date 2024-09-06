import { Prisma } from "@prisma/client";
import db from "../config/database";
import { onlyNumbers } from "../helpers/string_helper";

class PeopleService {
  getPeople = async (
    query: Prisma.pessoaWhereInput | undefined = undefined
  ) => {
    const people = await db.pessoa.findMany({
      where: query,
      orderBy: { razao_social: "asc" },
    });

    return people;
  };

  createPerson = async (body: any) => {
    const person = await db.pessoa.create({
      data: {
        razao_social: body.razao_social,
        nome_fantasia: body.nome_fantasia || "",
        cpf_cnpj: onlyNumbers(body.cpf_cnpj),
        tipo_pessoa: body.tipo_pessoa || ["CLI"],
        usuario_id: body.usuario_id || null,
      },
    });

    return person;
  };

  showPerson = async (id: number) => {
    const person = await db.pessoa.findFirst({ where: { id: id } });

    return person;
  };

  deletePerson = async (id: number) => {
    const person = await db.pessoa.delete({ where: { id: id } });

    return person;
  };
}

export default new PeopleService();
