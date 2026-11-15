import type { CookieOptions } from 'express';

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  maxAge: Number(process.env['JWT_EXPIRES_IN']) * 1000,
  path: '/',
  sameSite: 'lax',
  secure: process.env['NODE_ENV'] === 'production',
};
