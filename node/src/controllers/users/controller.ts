import { Request, Response, NextFunction } from "express";
import { db, cachedSearchResult } from "../../express-app";
import { moveInArray } from "../../utils/utils";

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
      cachedSearchResult[`${query}`] = (
        cachedSearchResult[`${query}`] || db
      ).filter((user) => {
        return new RegExp(query, "i").test(user.username);
      });

      const paginatedUsers = cachedSearchResult[`${query}`].slice(
        startIndex,
        endIndex,
      );
      const totalPages = Math.ceil(
        cachedSearchResult[`${query}`].length / pageSize,
      );

      res.json({
        results: paginatedUsers,
        pagination: {
          currentPage: page,
          pageSize,
          totalPages,
          totalItems: cachedSearchResult[`${query}`].length,
        },
      });
      console.log(page);
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
  position?: { q?: string; oldIndex: number; newIndex: number };
};
export function patchUsers(
  req: Request<{}, {}, PatchBody>,
  res: Response,
  next: NextFunction,
) {
  try {
    // Get search query to use it as a key to find in cached results
    const query = req.body.position?.q ? String(req.body.position.q) : null;

    //
    // Update position
    //
    if (req.body.position) {
      // update position in cached search results (in hash map)
      if (query) {
        moveInArray(
          cachedSearchResult[`${query}`],
          req.body.position.oldIndex,
          req.body.position.newIndex,
        );
      } else {
        // Update original db
        moveInArray(db, req.body.position.oldIndex, req.body.position.newIndex);
      }
    }

    //
    // Update checkbox
    //
    // TODO: refactor (add validation middleware)
    if (req.body.id === undefined || req.body.isChecked === undefined) {
      res.status(400).end();
      return;
    }

    const objIndex = db.findIndex((user) => user.id === req.body.id);
    db[objIndex].isChecked = req.body.isChecked;

    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
