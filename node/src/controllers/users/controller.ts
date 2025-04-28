import { Request, Response, NextFunction } from "express";
import { db } from "../../express-app";
import { UserRecord } from "../../types";
import { moveInArray } from "../../urils/utils";

let cachedSearchResult: UserRecord[] = [];

export function readUsers(
  req: Request<
    {},
    Record<string, unknown>,
    Record<string, unknown>,
    { page?: number; pagesize?: number; q?: string }
  >,
  res: Response,
  next: NextFunction,
) {
  try {
    // Pagination

    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pagesize) || 20;

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // Handle search query (TODO: refactor, add validation middleware)

    const query = req.query.q ? String(req.query.q) : null;

    if (query) {
      cachedSearchResult = db.filter((user) => {
        return new RegExp(query, "i").test(user.username);
      });

      const paginatedUsers = cachedSearchResult.slice(startIndex, endIndex);
      const totalPages = Math.ceil(cachedSearchResult.length / pageSize);

      res.json({
        results: paginatedUsers,
        pagination: {
          currentPage: page,
          pageSize,
          totalPages,
          totalItems: cachedSearchResult.length,
        },
      });
    } else {
      const paginatedUsers = db.slice(startIndex, endIndex);
      const totalPages = Math.ceil(db.length / pageSize);

      res.json({
        results: paginatedUsers,
        pagination: {
          currentPage: page,
          pageSize,
          totalPages,
          totalItems: db.length,
        },
      });
    }
  } catch (err) {
    next(err);
  }
}

type PatchBody = {
  id?: number;
  isChecked?: boolean;
  position?: { oldIndex: number; newIndex: number };
};
export function patchUsers(
  req: Request<{}, {}, PatchBody>,
  res: Response,
  next: NextFunction,
) {
  try {
    // Update position
    if (req.body.position) {
      moveInArray(req.body.position.oldIndex, req.body.position.newIndex);
    }

    // Update checkbox
    // TODO: refactor (add validation middleware)
    if (req.body.id !== undefined && req.body.isChecked !== undefined) {
      const objIndex = db.findIndex((user) => user.id === req.body.id);
      db[objIndex].isChecked = req.body.isChecked;
    }

    console.log(db);

    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
