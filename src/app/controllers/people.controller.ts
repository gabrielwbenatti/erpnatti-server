import { Request, Response } from "express";
import peopleService from "../services/people.service";
import HttpStatusCode from "../helpers/http_status_code";
import { numbersOnly } from "../helpers/string_helper";
import { successResponse } from "../helpers/http_responses";

class PeopleController {
  getPeople = async (req: Request, res: Response) => {
    const search = req.query.search?.toString();

    const result = search
      ? await peopleService.getPeople({
          OR: [
            { nome_fantasia: { contains: search, mode: "insensitive" } },
            { razao_social: { contains: search, mode: "insensitive" } },
            {
              cpf_cnpj: { contains: numbersOnly(search), mode: "insensitive" },
            },
          ],
        })
      : await peopleService.getPeople();

    if (result) {
      successResponse(res, result, HttpStatusCode.OK, {
        count: result.length,
      });
    }
  };

  createPerson = async (req: Request, res: Response) => {
    const body = req.body;

    if (body.cpf_cnpj) {
      const personExists = await peopleService.getPeople({
        cpf_cnpj: { equals: numbersOnly(body.cpf_cnpj) },
      });

      if (personExists.length > 0) {
        res
          .status(HttpStatusCode.CONFLICT)
          .json({ message: "Duplicated person" });
        return;
      }
    }

    const person = await peopleService.createPerson(body);

    if (person) {
      successResponse(res, person, HttpStatusCode.CREATED);
    }
  };

  showPerson = async (req: Request, res: Response) => {
    const id = req.params.id;
    const person = await peopleService.showPerson(+id);

    if (person) {
      successResponse(res, person, HttpStatusCode.OK);
    }
  };

  updatePerson = async (req: Request, res: Response) => {
    const body = req.body;
    const id = req.params.id;
    const person = await peopleService.updatePerson(+id, body);

    if (person) {
      successResponse(res, person, HttpStatusCode.OK);
    }
  };

  deletePerson = async (req: Request, res: Response) => {
    const id = req.params.id;
    const person = await peopleService.deletePerson(+id);

    if (person) {
      successResponse(res, person, HttpStatusCode.ACCEPTED);
    }
  };
}

export default new PeopleController();
