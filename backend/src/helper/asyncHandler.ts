import type { Request, Response, NextFunction } from 'express';

// Global Async handler Function
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next).catch(next));
  };
};
