import HomeController from '#infra/http/controllers/v1/HomeController';
import middlewares from '#infra/http/middlewares/index';
import { type Request, type Response, Router } from 'express';

const router = Router();

router.get('', middlewares.JwtMiddleware, (req: Request, res: Response) =>
  new HomeController().fetchSummary(req, res),
);

export default router;
