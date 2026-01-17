import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { sendErrorResponse } from '../common';

interface JwtPayload {
  userId: number;
  email: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendErrorResponse(res, {
      statusCode: 401,
      message: 'Unauthorized'
    });
  }

  try {
    const token = authHeader.split(' ')[1];

    if (!token) {
      return sendErrorResponse(res, {
        statusCode: 401,
        message: 'Token not found'
      });
    }

    if (!process.env.JWT_SECRET) {
      return sendErrorResponse(res, {
        statusCode: 500,
        message: 'JWT configuration missing'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);

    if (error.name === 'TokenExpiredError') {
      return sendErrorResponse(res, {
        statusCode: 401,
        message: 'Token has expired'
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return sendErrorResponse(res, {
        statusCode: 401,
        message: 'Invalid token'
      });
    }

    return sendErrorResponse(res);
  }
};
