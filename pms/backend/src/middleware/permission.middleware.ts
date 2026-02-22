import { NextFunction, Response } from 'express';

import { AuthRequest } from '../dtos/auth.dto';
import { PermissionService } from '../services/permission.service';
import { createErrorResponse, sendErrorResponse } from '../utils/response.util';

export const requireOrgRole = (allowedRoles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const organizationId = Number(req.body.orgId);
    const userId = req.user?.userId;

    if (!organizationId || !userId || isNaN(organizationId)) {
      return sendErrorResponse(
        res,
        createErrorResponse(400, 'Organization ID is required')
      );
    }

    try {
      const hasPermission = await PermissionService.hasRequiredRole(
        userId,
        organizationId,
        allowedRoles
      );

      if (!hasPermission) {
        return sendErrorResponse(res, createErrorResponse(403, 'Forbidden'));
      }

      next();
    } catch (error) {
      console.error('Error checking organization role:', error);
      return sendErrorResponse(res);
    }
  };
};
