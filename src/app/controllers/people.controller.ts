import { Request, Response } from "express";
import peopleService from "../services/people.service";
import HttpStatusCode from "../helpers/http_status_code";
import peopleValidator from "../validators/people.validator";
import { successResponse } from "../helpers/http_responses";
import { pessoasTable } from "../../db/schema";
import { eq } from "drizzle-orm";

class PeopleController {
  getPeople = async (req: Request, res: Response) => {
    const search = req.query.search?.toString();

    const result = await peopleService.getPeople(undefined);

    if (result) {
      successResponse(res, result, HttpStatusCode.OK, {
        count: result.length,
      });
    }
  };

  createPerson = async (req: Request, res: Response) => {
    const body = req.body;
    const { cpf_cnpj } = body;

    if (cpf_cnpj) {
      const isDuplicate = await peopleValidator.isDuplicatedPerson(cpf_cnpj);

      if (isDuplicate)
        return res
          .status(HttpStatusCode.CONFLICT)
          .json({ message: "Duplicated person" });
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
