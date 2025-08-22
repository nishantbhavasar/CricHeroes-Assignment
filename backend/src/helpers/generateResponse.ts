import RESPONSE_CODE from "../constant/responseCode";
import { Response } from "express";

export const generateResponse = ({
  res,
  statusCode,
  message,
  data,
  success,
}: {
  res: Response;
  statusCode: number;
  message: string;
  data?: any;
  success: boolean;
}) => {
  return res.status(statusCode).json({
    success: success ?? (statusCode === RESPONSE_CODE.SUCCESS || statusCode < 300),
    message,
    data,
  });
};
