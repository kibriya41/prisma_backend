import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";
import { verifyToken } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
  user?: JwtPayload & { id: string; role: string };
}

export const auth =
  (...roles: string[]) =>
    (req: Request, res: Response, next: NextFunction) => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          throw new ApiError(401, "No token provided");
        }

        const token = authHeader.split(" ")[1];
        if (!token) throw new ApiError(401, "No token provided");

        const decoded = verifyToken(
          token,
          config.jwt.access_secret
        ) as JwtPayload & { id: string; role: string };

        if (roles.length && !roles.includes(decoded.role)) {
          throw new ApiError(403, "Forbidden access");
        }

        (req as CustomRequest).user = decoded;
        next();
      } catch (err) {
        next(err);
      }
    };
