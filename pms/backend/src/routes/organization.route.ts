import { Router } from 'express';

import {
  createOrganization,
  listUserOrganizations
} from '../controllers/organization.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/my-organizations', authMiddleware, listUserOrganizations);
router.post('/create-organization', authMiddleware, createOrganization);
export default router;
