import { Request, Response } from "express";
import peopleService from "../services/people.service";
import HttpStatusCode from "../helpers/http_status_code";
import { onlyNumbers } from "../helpers/string_helper";
import { successResponse } from "../helpers/http_responses";

class PeopleController {
  getPeople = async (req: Request, res: Response) => {
    const search = req.query.search?.toString();

    const result = search
      ? await peopleService.getPeople({
          OR: [
            {
              nome_fantasia: { contains: search, mode: "insensitive" },
            },
            {
              razao_social: { contains: search, mode: "insensitive" },
            },
            {
              cpf_cnpj: { contains: onlyNumbers(search), mode: "insensitive" },
            },
          ],
        })
      : await peopleService.getPeople();

    if (result) {
      successResponse(res, HttpStatusCode.OK, result);
    }
  };

  createPerson = async (req: Request, res: Response) => {
    const body = req.body;

    const personExists = await peopleService.getPeople({
      cpf_cnpj: { equals: onlyNumbers(req.body.cpf_cnpj) },
    });

    if (personExists.length > 0) {
      res.statusCode = HttpStatusCode.CONFLICT;
      res.json({ message: "Duplicated person" });
      return;
    }

    const person = await peopleService.createPerson(body);

    if (person) {
      successResponse(res, HttpStatusCode.CREATED, person);
    }
  };

  showPerson = async (req: Request, res: Response) => {
    const id = req.params.id;
    const person = await peopleService.showPerson(+id);

    if (person) {
      successResponse(res, HttpStatusCode.OK, person);
    }
  };

  deletePerson = async (req: Request, res: Response) => {
    const id = req.params.id;
    const person = await peopleService.deletePerson(+id);

    if (person) {
      successResponse(res, HttpStatusCode.ACCEPTED, person);
    }
  };
}

export default new PeopleController();
