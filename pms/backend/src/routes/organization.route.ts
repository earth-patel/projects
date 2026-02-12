import { Router } from 'express';

import { listUserOrganizations } from '../controllers/organization.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/my-organizations', authMiddleware, listUserOrganizations);
export default router;
