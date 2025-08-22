import RESPONSE_CODE from "../constant/responseCode";
import { Request, Response, NextFunction } from "express";

export const routeNotFound = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(404).json({
    statusCode: RESPONSE_CODE.NOT_FOUND,
    message: "Route Not Found",
    success: false,
    data: null,
  });
};
