import { Request, Response } from "express";
import peopleService from "../services/people.service";

class PeopleController {
  getPeople = async (_: Request, res: Response) => {
    const result = await peopleService.getPeople();

    res.send(result);
  };

  createPerson = async (req: Request, res: Response) => {
    const body = req.body;
    const result = await peopleService.createPerson(body);

    res.send(result);
  };

  showPerson = async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await peopleService.showPerson(+id);

    res.send(result);
  };

  deletePerson = async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await peopleService.deletePerson(+id);

    res.send(result);
  };
}

export default new PeopleController();
