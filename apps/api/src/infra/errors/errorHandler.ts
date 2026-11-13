import HTTP from 'http';
import { isAxiosError } from 'axios';
import { isCelebrateError } from 'celebrate';
import type { NextFunction, Request, Response } from 'express';

import AppError from '#app/errors/AppError';
import AppHttpError from '#app/errors/AppHttpError';

export default async function errorHandler(
  error: Error,
  _: Request,
  res: Response,
): Promise<Response> {
  if (isCelebrateError(error)) {
    const statusCode = 422;
    const validation: Record<string, Record<string, string | string[]>> = {};

    error.details.entries().forEach(([segment, joiError]) => {
      validation[segment] = {
        source: segment,
        keys: joiError.details.map((detail) => detail.path.join()),
        message: joiError.message,
      };
    });

    return res
      .status(statusCode)
      .json({
        error: HTTP.STATUS_CODES[statusCode],
        message: error.message,
        statusCode,
        validation,
      });
  }

  if (error instanceof AppError) {
    return res
      .status(500)
      .json({ code: error.errorCode, message: error.message });
  }

  if (error instanceof AppHttpError) {
    return res
      .status(error.statusCode)
      .json({
        code: error.errorCode,
        errors: error.errors,
        message: error.message,
      });
  }

  if (isAxiosError(error)) {
    return res
      .status(500)
      .json({
        errors: [error.response?.data],
        message: 'Internal server error',
      });
  }

  return res
    .status(500)
    .json({ errors: [error.message], message: 'Internal server error' });
}
