import { Router } from 'express';

import userRoutes from '#infra/http/routes/v1/user.routes';

const router = Router();

router.use('/user', userRoutes);

export default router;
