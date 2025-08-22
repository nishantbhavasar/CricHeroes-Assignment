import RESPONSE_CODE from "@/constant/responseCode";
import { Request, Response, NextFunction } from "express";

export const errroHandler = (
  error: {
    status: number;
    message: string;
  },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(error.status || 500).json({
    success: false,
    statusCode: error.status ?? RESPONSE_CODE.INTERNAL_SERVER_ERROR,
    message: error.message ?? "Internal Server Error",
    data: null,
  });
};
