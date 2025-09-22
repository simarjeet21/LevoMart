import { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "../utils/errors/not-authorized-error";
import { ForbiddenRequestError } from "../utils/errors/forbidden-request-error";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }
  next();
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser || !roles.includes(req.currentUser.role)) {
      throw new ForbiddenRequestError();
    }
    next();
  };
};
