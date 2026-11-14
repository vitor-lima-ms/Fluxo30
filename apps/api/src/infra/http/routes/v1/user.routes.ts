import { type Request, type Response, Router } from 'express';

import middlewares from '#infra/http/middlewares/index';
import UserController from '#infra/http/controllers/v1/UserController';

const router = Router();

router.get('', middlewares.JwtMiddleware, (req: Request, res: Response) =>
  new UserController().fetchById(req, res),
);
router.post(
  '/login',
  middlewares.User_LoginRequest,
  (req: Request, res: Response) => new UserController().login(req, res),
);
router.post(
  '/logout',
  middlewares.JwtMiddleware,
  (req: Request, res: Response) => new UserController().logout(req, res),
);

export default router;
