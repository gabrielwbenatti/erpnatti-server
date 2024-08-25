import { Request, Response } from "express";
import peopleService from "../services/people.service";
import HttpStatusCode from "../helpers/http_status_code";

class PeopleController {
  getPeople = async (req: Request, res: Response) => {
    const search = req.query.search?.toString();

    const result = search
      ? await peopleService.getPeople({
          OR: [
            { nome_fantasia: { contains: search, mode: "insensitive" } },
            { razao_social: { contains: search, mode: "insensitive" } },
            { cpf_cnpj: { contains: search, mode: "insensitive" } },
          ],
        })
      : await peopleService.getPeople();

    res.send(result);
  };

  createPerson = async (req: Request, res: Response) => {
    const body = req.body;
    const person = await peopleService.createPerson(body);

    if (person) {
      res.status(HttpStatusCode.CREATED).send(person);
    }
  };

  showPerson = async (req: Request, res: Response) => {
    const id = req.params.id;
    const person = await peopleService.showPerson(+id);

    res.send(person);
  };

  deletePerson = async (req: Request, res: Response) => {
    const id = req.params.id;
    const person = await peopleService.deletePerson(+id);

    res.send(person);
  };
}

export default new PeopleController();
