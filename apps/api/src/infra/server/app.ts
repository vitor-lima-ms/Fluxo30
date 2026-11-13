import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import errorHandler from '#infra/errors/errorHandler';
import middlewares from '#infra/http/middlewares/index';
import routes from '#infra/http/routes/index';

export default async function setupApp(): Promise<void> {
  const app = express();
  const fileSize = 30;

  app.use(cors({ credentials: true, origin: process.env['FRONTEND_ORIGIN'] }));
  app.use(express.json({ limit: `${fileSize}mb` }));
  app.use(express.urlencoded({ limit: `${fileSize}mb`, extended: true }));
  app.use(cookieParser());
  app.use(middlewares.RequestLogMiddleware);
  app.use(routes);
  app.use(errorHandler);

  const host = process.env['APP_HOST'] || '0.0.0.0';
  const port = Number(process.env['APP_PORT']) || 3000;

  app.listen(port, host, () => {
    console.log(`[SERVER]: Server is running at ${host}:${port}.`);
  });
}
