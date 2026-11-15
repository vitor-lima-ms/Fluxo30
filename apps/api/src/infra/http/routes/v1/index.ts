import homeRoutes from '#infra/http/routes/v1/home.routes';
import { Router } from 'express';
import userRoutes from '#infra/http/routes/v1/user.routes';

const router = Router();

router.use('/home', homeRoutes);
router.use('/user', userRoutes);

export default router;
