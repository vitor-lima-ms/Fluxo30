import type { NextFunction, Request, Response } from 'express';
import type { ParamsDictionary, Query } from 'express-serve-static-core';

type JsonValue =
  string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
interface RequestLog {
  startTime: string;
  endTime: string | undefined;
  interval: string | undefined;
  ip: string | undefined;
  endpoint: string | undefined;
  method: string | undefined;
  statusCode: number | undefined;
  params: ParamsDictionary | undefined;
  query: Query | undefined;
  body: JsonValue | undefined;
}

function logHelper(req: Request, output: RequestLog): void {
  if (req.method === 'GET' || req.method === 'DELETE') {
    output['params'] = req.params;
    output['query'] = req.query;
  } else {
    output['body'] = req.body;
  }
}

export default function RequestLogMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (process.env['APP_LOG_REQUESTS'] !== 'true') return next();

  const output: RequestLog = {
    startTime: '',
    body: undefined,
    endpoint: undefined,
    endTime: undefined,
    interval: undefined,
    ip: undefined,
    method: undefined,
    params: undefined,
    query: undefined,
    statusCode: undefined,
  };

  const startTime = Date.now();
  output['startTime'] = new Date(startTime).toISOString();

  res.on('finish', () => {
    output['ip'] = req.ip;
    output['endpoint'] = req.originalUrl;
    output['method'] = req.method;
    if (process.env['NODE_ENV'] === 'development') logHelper(req, output);
    output['statusCode'] = res.statusCode;

    const endTime = Date.now();
    output['endTime'] = new Date(endTime).toISOString();

    output['interval'] = `${(endTime - startTime) / 1000}s`;

    console.log('[LOG]:', output);
  });

  next();
}
