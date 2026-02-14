import { type Response } from 'express';

import { AuthRequest } from '../dtos/auth.dto';
import { getUserOrganizations } from '../services/organization.service';
import { createErrorResponse, sendErrorResponse } from '../utils/response.util';

/* ---------- CONTROLLERS ---------- */
export const listUserOrganizations = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const organizations = await getUserOrganizations(req.user.userId);

    if (!organizations) {
      return sendErrorResponse(
        res,
        createErrorResponse(
          404,
          'No organizations found. Please create a new organization to continue.'
        )
      );
    }
    return res.status(200).json(organizations);
  } catch (error) {
    console.error('Error listing user organizations:', error);
    return sendErrorResponse(res);
  }
};
