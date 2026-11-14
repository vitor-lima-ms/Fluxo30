import HealthCheckController from '#infra/http/controllers/HealthCheckController';
import { type Request, type Response, Router } from 'express';

const router = Router();

router.get('/health', (req: Request, res: Response) =>
  new HealthCheckController().healthCheck(req, res),
);

export default router;
