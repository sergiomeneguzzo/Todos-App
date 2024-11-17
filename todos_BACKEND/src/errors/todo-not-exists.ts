import { Request, Response, NextFunction } from 'express';

export class TodoNotFound extends Error {
  constructor() {
    super();
    this.name = 'TodoNotFound';
    this.message = 'Todo not Found';
  }
}
export const todoNotExistsHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);
  res.status(404);
  res.json({
    error: 'TodoNotExists',
    message: 'Todo not Found',
  });
};
