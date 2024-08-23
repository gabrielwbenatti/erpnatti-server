import { Request, Response } from "express";
import personService from "../services/person.service";

class PersonController {
  getPeople = async (_: Request, res: Response) => {
    const result = await personService.getPeople();

    res.send(result);
  };

  createPerson = async (req: Request, res: Response) => {
    const body = req.body;
    const result = await personService.createPerson(body);

    res.send(result);
  };

  showPerson = async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await personService.showPerson(+id);

    res.send(result);
  };

  deletePerson = async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await personService.deletePerson(+id);

    res.send(result);
  };
}

export default new PersonController();
