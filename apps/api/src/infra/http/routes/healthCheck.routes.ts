import { type Request, type Response, Router } from 'express';

import HealthCheckController from '#infra/http/controllers/HealthCheckController';

const router = Router();

router.get('health', (req: Request, res: Response) =>
  new HealthCheckController().healthCheck(req, res),
);

export default router;
