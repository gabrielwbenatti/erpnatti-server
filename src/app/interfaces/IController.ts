import { NextFunction, Request, Response } from "express";

export interface IController {
  index(req: Request, res: Response, next?: NextFunction): Promise<void>;
  store(req: Request, res: Response, next?: NextFunction): Promise<void>;
  show(req: Request, res: Response, next?: NextFunction): Promise<void>;
  update(req: Request, res: Response, next?: NextFunction): Promise<void>;
  remove(req: Request, res: Response, next?: NextFunction): Promise<void>;
}
