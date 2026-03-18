import { NextFunction, Response } from 'express';

import { AuthRequest } from '../dtos/auth.dto';
import { getUserRoleInOrg } from '../services/permission.service';
import { createErrorResponse, sendErrorResponse } from '../utils/response.util';

/**
 * Middleware factory that checks whether the authenticated user holds one of
 * the `allowedRoles` inside the target organization.
 *
 * Reads `organizationId` from:
 *   1. req.body.organizationId   (POST/PATCH requests)
 *   2. req.params.organizationId (routes with :organizationId URL segment)
 */
export const requireRole = (allowedRoles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const organizationId = Number(
      req.body.organizationId ?? req.params.organizationId
    );
    const userId = req.user?.userId;
    console.log(req.body);
    if (!organizationId || isNaN(organizationId)) {
      return sendErrorResponse(
        res,
        createErrorResponse(400, 'Organization ID is required', {
          general: 'Organization ID is required.'
        })
      );
    }

    try {
      const roleName = await getUserRoleInOrg(userId, organizationId);

      if (!roleName || !allowedRoles.includes(roleName)) {
        return sendErrorResponse(
          res,
          createErrorResponse(403, 'Insufficient permissions', {
            general: 'You do not have permission to perform this action'
          })
        );
      }

      next();
    } catch (error) {
      console.error('Error checking permissions:', error);
      return sendErrorResponse(res);
    }
  };
};
