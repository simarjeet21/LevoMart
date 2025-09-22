import { CustomError } from "../utils/errors/custom-error";
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).send({ errors: err.serializeErrors() });
    return;
  }

  res.status(400).send({
    errors: [{ message: "Something went wrong" }],
  });
};
