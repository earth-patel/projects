import { NextFunction, Response } from 'express';

import { AuthRequest } from '../dtos/auth.dto';
import { verifyJwtAccessToken } from '../services/jwt.service';
import { createErrorResponse, sendErrorResponse } from '../utils/response.util';

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return sendErrorResponse(
      res,
      createErrorResponse(401, 'Unauthorized', {
        form: 'Unauthorized access. Please try logging in again'
      })
    );
  }

  try {
    const token = authHeader.split(' ')[1];
    if (!token) {
      return sendErrorResponse(
        res,
        createErrorResponse(401, 'Token not found', {
          form: 'Token not found. Please try logging in again'
        })
      );
    }

    req.user = verifyJwtAccessToken(token);
    next();
  } catch (error) {
    console.error('Error verifying token:', error);

    if (error.name === 'TokenExpiredError') {
      return sendErrorResponse(
        res,
        createErrorResponse(401, 'Token has expired', {
          form: 'Token has expired. Please try logging in again'
        })
      );
    }
    if (error.name === 'JsonWebTokenError') {
      return sendErrorResponse(
        res,
        createErrorResponse(401, 'Invalid token', { form: 'Invalid token' })
      );
    }

    return sendErrorResponse(res);
  }
};
