import type { Response } from 'express';

import { AuthRequest } from '../dtos/auth.dto';
import { getUserOrganizations } from '../services/organization.service';

export const listMyOrganizations = async (req: AuthRequest, res: Response) => {
  const organizations = await getUserOrganizations(req.user!.userId);

  res.status(200).json(organizations);
};
