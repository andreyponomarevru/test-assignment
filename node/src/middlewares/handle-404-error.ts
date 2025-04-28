import util from "util";
import { Request, Response, NextFunction } from "express";

export function handle404Error(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  console.error(`Error 404 forwarded to main error handler`);
  console.error(
    `Request to nonexistent resource:\nheaders:\n${util.inspect(
      req.headers,
    )}\nurl:\n${req.url}\npath:\n${req.path}`,
  );
  next({ status: 404, message: "The requested page does not exist" });
}
