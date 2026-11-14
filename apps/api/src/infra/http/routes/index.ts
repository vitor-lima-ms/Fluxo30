import { Router } from 'express';

import healthCheckRouter from '#infra/http/routes/healthCheck.routes';
import v1Router from '#infra/http/routes/v1/index';

const routers = Router();

routers.use('/api', healthCheckRouter);
routers.use('/api/v1', v1Router);

export default routers;
