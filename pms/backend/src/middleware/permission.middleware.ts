import { NextFunction, Response } from 'express';

import { AuthRequest } from '../dtos/auth.dto';
import {
  getRoleModulePermission,
  hasPermission
} from '../services/permission.service';
import { PermissionAction } from '../types/permission.type';
import { createErrorResponse, sendErrorResponse } from '../utils/response.util';

export const requirePermission = (
  moduleName: string,
  action: PermissionAction
) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const permission = await getRoleModulePermission(req.role, moduleName);

    if (!permission) {
      return sendErrorResponse(res, createErrorResponse(403, 'No permission'));
    }

    if (!hasPermission(permission.actions, action)) {
      return sendErrorResponse(
        res,
        createErrorResponse(403, 'Permission denied')
      );
    }

    next();
  };
};
