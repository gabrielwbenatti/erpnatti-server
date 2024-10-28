import { NextFunction, Request, Response } from "express";
import peopleService from "../services/PeopleServices";
import peopleValidator from "../validators/people.validator";
import { successResponse } from "../helpers/http_responses";
import { HttpStatusCode } from "../helpers/http_status_code";
import { IController } from "../interfaces/IController";
import {
  DuplicatedRecordError,
  MissingFieldError,
} from "../helpers/http_error";
import { numbersOnly } from "../helpers/string_helper";

class PeopleController implements IController {
  async index(req: Request, res: Response) {
    const { search } = req.query;

    const result = await peopleService.getPeople({ search });

    if (result) {
      successResponse(res, result, HttpStatusCode.OK, {
        count: result.length,
      });
    }
  }

  async store(req: Request, res: Response, next: NextFunction) {
    const body = req.body;
    const { company_name, cpf_cnpj } = body;

    try {
      if (!company_name || company_name === "") {
        throw new MissingFieldError("company_name");
      }

      if (cpf_cnpj) {
        const document = numbersOnly(cpf_cnpj);
        const isDuplicate = await peopleValidator.isDuplicatedPerson(document);

        if (isDuplicate) {
          throw new DuplicatedRecordError("person", "cpf_cnpj");
        }
      }

      const person = await peopleService.createPerson(body);

      if (person) {
        successResponse(res, person, HttpStatusCode.CREATED);
      }
    } catch (error) {
      return next(error);
    }
  }

  async show(req: Request, res: Response) {
    const id = req.params.id;
    const person = await peopleService.showPerson(+id);

    if (person) {
      successResponse(res, person, HttpStatusCode.OK);
    }
  }

  async update(req: Request, res: Response) {
    const body = req.body;
    const id = req.params.id;
    const person = await peopleService.updatePerson(+id, body);

    if (person) {
      successResponse(res, person, HttpStatusCode.OK);
    }
  }

  async remove(req: Request, res: Response) {
    const id = req.params.id;
    const person = await peopleService.deletePerson(+id);

    if (person) {
      successResponse(res, person, HttpStatusCode.ACCEPTED);
    }
  }
}

export default new PeopleController();
