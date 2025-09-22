import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserPayload } from "../types/jwt_payload";

// interface UserPayload {
//   id: string;
//   email: string;
//   role: string;
// }

// declare global {
//   namespace Express {
//     interface Request {
//       currentUser?: UserPayload;
//     }
//   }
// }

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }
  // if (!req.session?.jwt) {
  //   return next();
  // }
  const token = authHeader.replace("Bearer ", "").trim();
  const jwt_key = Buffer.from(
    "TmV3U2VjcmV0S2V5Rm9ySldUU2lnbmluZ1B1cnBvc2VzMTIzNDU2Nzg=",
    "base64"
  ).toString("utf-8");

  try {
    const payload = jwt.verify(token, jwt_key) as UserPayload;

    req.currentUser = payload;
    console.log("Current user:", req.currentUser);
  } catch (err) {
    console.error("Error parsing JWT:", err);
  }
  next();
};
