// src/utils/async-handler.ts
import { Request, Response, NextFunction, RequestHandler } from "express";

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next); // pass errors to Express error handler
  };
}
