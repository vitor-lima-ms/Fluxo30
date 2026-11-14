import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';

import AppError from '#app/errors/AppError';
import AppHttpError from '#app/errors/AppHttpError';

export default function JwtMiddleware(
  req: Request,
  _: Response,
  next: NextFunction,
): void {
  if (!process.env['JWT_SECRET']) {
    throw new AppError({
      errorCode: 'ENV_JWT_SECRET_ABSENT',
      message: 'JWT Secret não foi definido',
    });
  }

  const token = req.cookies['accessToken'];
  if (typeof token !== 'string' || !token.length) {
    throw new AppHttpError({
      errorCode: 'AUTH_COOKIE_NOT_SENT',
      message: 'Cookie de autenticação não enviado',
      statusCode: 401,
      errors: undefined,
      internalMessage: undefined,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env['JWT_SECRET']);
    if (typeof decoded === 'string') {
      throw new AppError({
        errorCode: 'INVALID_DECODED_TOKEN',
        message: 'Token decodificado inválido',
      });
    }
    const sub = decoded['sub'];
    const email = decoded['email'];
    if (
      typeof sub !== 'string'
      || !sub.length
      || typeof email !== 'string'
      || !email.length
    ) {
      throw new AppError({
        errorCode: 'UNDEFINED_REQUIRED_PROPERTY',
        message:
          'Uma das propriedades obrigatórias do token decodificado é undefined',
      });
    }

    req.user = { email, id: sub };

    next();
  } catch (error) {
    if (error instanceof AppError || error instanceof AppHttpError) throw error;

    if (
      error instanceof jwt.JsonWebTokenError
      || error instanceof jwt.TokenExpiredError
    ) {
      throw new AppHttpError({
        errorCode: 'INVALID_AUTH_TOKEN',
        message: 'Token de autenticação inválido',
        statusCode: 401,
        errors: undefined,
        internalMessage: undefined,
      });
    }

    throw new AppError({
      errorCode: 'JWT_MIDDLEWARE_ERROR',
      message: 'Erro no JwtMiddleware',
      internalMessage: error,
    });
  }
}
