import { Request, Response, NextFunction } from "express";
import { db, cachedSearchResult } from "../../express-app";
import { moveInArray, moveInArrayById } from "../../utils/utils";

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
  indexPosition?: { oldIndex: number; newIndex: number };
  idPosition?: { itemId: number; moveAfterId: number };
};
export function patchUsers(
  req: Request<{}, {}, PatchBody>,
  res: Response,
  next: NextFunction,
) {
  try {
    // TODO: refactor (replace 'if' with the 'switch' statement/add validation middleware)

    //
    // Update position
    //
    if (req.body.indexPosition) {
      moveInArray(
        req.body.indexPosition.oldIndex,
        req.body.indexPosition.newIndex,
      );
      res.status(204).end;
      return;
    }

    if (req.body.idPosition) {
      moveInArrayById(
        req.body.idPosition.itemId,
        req.body.idPosition.moveAfterId,
      );
      res.status(204).end;
      return;
    }

    //
    // Update checkbox
    //

    if (req.body.id && req.body.isChecked) {
      const objIndex = db.findIndex((user) => user.id === req.body.id);
      db[objIndex].isChecked = req.body.isChecked;
      res.status(204).end();
      return;
    }
  } catch (err) {
    next(err);
  }
}
