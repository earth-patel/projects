import { Router } from 'express';

import { listMyOrganizations } from '../controllers/organization.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/mine', authMiddleware, listMyOrganizations);

export default router;
