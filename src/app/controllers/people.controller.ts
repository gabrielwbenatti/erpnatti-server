import { Request, Response } from "express";
import peopleService from "../services/people.service";
import peopleValidator from "../validators/people.validator";
import { successResponse } from "../helpers/http_responses";
import { HttpStatusCode } from "../helpers/http_status_code";
import { ControllerInterface } from "../interfaces/controller.interface";

class PeopleController implements ControllerInterface {
  async index(req: Request, res: Response) {
    const { search } = req.query;

    const result = await peopleService.getPeople({ search });

    if (result) {
      successResponse(res, result, HttpStatusCode.OK, {
        count: result.length,
      });
    }
  }

  async store(req: Request, res: Response) {
    const body = req.body;
    const { cpf_cnpj } = body;

    if (cpf_cnpj) {
      const isDuplicate = await peopleValidator.isDuplicatedPerson(cpf_cnpj);

      if (isDuplicate) {
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
