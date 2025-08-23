
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export function validatePayload(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req?.body ?? {});
    if (error) {
      next({
          message:error?.details?.[0]?.message ?? "Request Body Not Valid",
          status:400,
      });
    }else{
        next();
    }
  };
}