import AppHttpError from '#app/errors/AppHttpError';
import { HttpStatusCode } from 'axios';
import { throttle } from 'node:util';
import type { NextFunction, Request, Response } from 'express';

const INTERVAL_MS = 15 * 60 * 1000;
const LIMIT = 5;
const MAX_KEYS = 10_000;

interface Bucket {
  lastUsed: number;
  run: ReturnType<typeof throttle>;
}

const buckets = new Map<string, Bucket>();

function isErrThrottled(error: unknown): boolean {
  return (
    typeof error === 'object'
    && error !== null
    && 'code' in error
    && error.code === 'ERR_THROTTLED'
  );
}

function evictExpired(now: number): void {
  for (const [ip, bucket] of buckets) {
    if (now - bucket.lastUsed >= INTERVAL_MS) {
      bucket.run.cancel();
      buckets.delete(ip);
    }
  }
}

function evictLru(): void {
  const oldest = buckets.keys().next().value;
  if (oldest === undefined) {
    return;
  }

  const bucket = buckets.get(oldest);
  bucket?.run.cancel();
  buckets.delete(oldest);
}

function getRun(ip: string): ReturnType<typeof throttle> {
  const now = Date.now();
  evictExpired(now);

  const existing = buckets.get(ip);
  if (existing !== undefined) {
    buckets.delete(ip);
    existing.lastUsed = now;
    buckets.set(ip, existing);
    return existing.run;
  }

  while (buckets.size >= MAX_KEYS) {
    evictLru();
  }

  const run = throttle(async () => undefined, LIMIT, INTERVAL_MS, {
    overflow: 'drop',
    strict: true,
  }).unref();

  buckets.set(ip, { lastUsed: now, run });
  return run;
}

function clientIp(req: Request): string {
  return req.ip ?? req.socket.remoteAddress ?? 'unknown';
}

export default async function User_LoginRateLimitMiddleware(
  req: Request,
  _: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await getRun(clientIp(req))();
    next();
  } catch (error) {
    if (isErrThrottled(error)) {
      throw new AppHttpError({
        errorCode: 'TOO_MANY_REQUESTS',
        errors: undefined,
        internalMessage: undefined,
        message: 'Muitas tentativas. Tente novamente mais tarde.',
        statusCode: HttpStatusCode.TooManyRequests,
      });
    }

    throw error;
  }
}
