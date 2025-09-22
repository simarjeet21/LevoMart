import { CustomError } from "./custom-error";

export class ForbiddenRequestError extends CustomError {
  statusCode = 403;

  constructor() {
    super("Forbidden");

    Object.setPrototypeOf(this, ForbiddenRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: "Not Allowed Forbidden" }];
  }
}
