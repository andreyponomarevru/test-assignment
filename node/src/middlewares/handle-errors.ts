import util from "util";
import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export function handleErrors(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  console.error(`Express Main Error Handler\n${util.inspect(err)}`);

  switch (true) {
    case err instanceof Joi.ValidationError:
      res.status(400).json({
        status: 400,
        message: err.details.map((err) => err.message).join("; "),
      });
      break;

    default:
      console.error(err);
      res.status(500).json({ status: 500, message: "Internal server error" });
  }
}
