import { Router } from 'express';

import healthCheckRouter from '#infra/http/routes/healthCheck.routes';

const routers = Router();

routers.use('/api', healthCheckRouter);

export default routers;
