import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import handleZodError from "../errors/handleZodError";
import ApiError from "../errors/apiError";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something Went Wrong";
  let errorDetails = err;

  if (err instanceof ZodError) {
    const zodError = handleZodError(err);
    statusCode = zodError.statusCode;
    message = zodError.message;
    errorDetails = zodError.errorDetails;
  } else if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = {
      error: err,
      statusCode: err.statusCode,
      stack: err.stack,
    };
  } else if (err instanceof Error) {
    message = err.message;
    statusCode = 401;
    errorDetails = {
      error: err,
      statusCode: 401,
      stack: err.stack,
    };
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
  });
};

export default globalErrorHandler;
