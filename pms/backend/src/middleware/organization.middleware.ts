import { NextFunction, Response } from 'express';

import { AuthRequest } from '../dtos/auth.dto';
import { getOrganizationMembership } from '../services/organization.service';
import { createErrorResponse, sendErrorResponse } from '../utils/response.util';

export const organizationMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const organizationId = Number(req.headers['x-organization-id']);

  if (!organizationId) {
    return sendErrorResponse(
      res,
      createErrorResponse(400, 'Organization required')
    );
  }

  if (!req.user) {
    return sendErrorResponse(res, createErrorResponse(401, 'Unauthorized'));
  }

  const membership = await getOrganizationMembership(
    req.user.userId,
    organizationId
  );

  if (!membership) {
    return sendErrorResponse(res, createErrorResponse(403, 'Access denied'));
  }

  req.organizationId = organizationId;
  req.role = membership.role.name;

  next();
};
