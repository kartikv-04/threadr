import type { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';

type ValidatedRequestData = {
  body?: Request['body'];
  params?: Request['params'];
  query?: Request['query'];
};

export const validate = (schema: ZodTypeAny) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!result.success) {
      return next(result.error);
    }

    const validated = result.data as ValidatedRequestData;

    if (validated.body !== undefined) {
      req.body = validated.body;
    }

    if (validated.params !== undefined) {
      req.params = validated.params;
    }

    if (validated.query !== undefined) {
      Object.assign(req.query, validated.query);
    }

    return next();
  };
};
