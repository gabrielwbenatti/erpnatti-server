import db from "./database";

class PeopleService {
  getPeople = async () => {
    const people = await db.pessoas.findMany();

    return people;
  };

  createPerson = async (body: any) => {
    const person = await db.pessoas.create({
      data: {
        razao_social: body.razao_social,
        nome_fantasia: body.nome_fantasia || "",
        cpf_cnpj: body.cpf_cnpj,
        tipo_pessoa: body.tipo_pessoa || ["CLI"],
        usuario_id: body.usuario_id || null,
      },
    });

    return person;
  };

  showPerson = async (id: number) => {
    const person = await db.pessoas.findFirst({ where: { id: id } });

    return person;
  };

  deletePerson = async (id: number) => {
    const person = await db.pessoas.delete({ where: { id: id } });

    return person;
  };
}

export default new PeopleService();
