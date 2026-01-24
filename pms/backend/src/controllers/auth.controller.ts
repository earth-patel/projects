import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { Prisma } from '../../generated/prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import {
  createUser,
  getUserById,
  loginUser,
  verifyEmailByToken
} from '../services/auth.service';
import { signJwtAccessToken } from '../services/jwt.service';
import { createErrorResponse, sendErrorResponse } from '../utils/response.util';
import {
  validateLoginDto,
  validateRegisterDto
} from '../utils/validation.util';

/* ---------- CONSTANTS ---------- */
const VALIDATION_FAILED = (errors: Record<string, string>) =>
  createErrorResponse(400, 'Validation failed', errors);

const INVALID_CREDENTIALS = createErrorResponse(
  401,
  'Invalid email or password',
  { form: 'Invalid email or password' }
);

const EMAIL_ALREADY_EXISTS = createErrorResponse(400, 'Email already in use', {
  email: 'Email already in use'
});

const USER_NOT_FOUND = createErrorResponse(401, 'User not found', {
  form: 'User not found'
});

/* ---------- CONTROLLERS ---------- */
export const register = async (req: Request, res: Response) => {
  const data = req.body as RegisterDto;

  const errors = validateRegisterDto(data);
  if (Object.keys(errors).length > 0) {
    return sendErrorResponse(res, VALIDATION_FAILED(errors));
  }

  try {
    await createUser(data);
    return res.status(201).json({
      message:
        'Registration successful. Please check your email to verify your account.'
    });
  } catch (error) {
    // Handle unique constraint violation for email
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return sendErrorResponse(res, EMAIL_ALREADY_EXISTS);
    }

    console.error('Error registering user:', error);
    return sendErrorResponse(res);
  }
};

export const login = async (req: Request, res: Response) => {
  const data = req.body as LoginDto;

  const errors = validateLoginDto(data);
  if (Object.keys(errors).length > 0) {
    return sendErrorResponse(res, VALIDATION_FAILED(errors));
  }

  try {
    const user = await loginUser(data.email);
    if (!user) return sendErrorResponse(res, INVALID_CREDENTIALS);
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) return sendErrorResponse(res, INVALID_CREDENTIALS);

    if (!user.emailVerifiedAt) {
      return sendErrorResponse(
        res,
        createErrorResponse(403, 'Email not verified', {
          form: 'Please verify your email to log in'
        })
      );
    }

    const token = signJwtAccessToken({ userId: user.id, email: user.email });

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    return sendErrorResponse(res);
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    const user = await getUserById(req.user.userId);

    if (!user) {
      return sendErrorResponse(res, USER_NOT_FOUND);
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return sendErrorResponse(res);
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return sendErrorResponse(
      res,
      createErrorResponse(400, 'Invalid or missing token')
    );
  }

  try {
    const user = await verifyEmailByToken(token);

    if (!user) {
      return sendErrorResponse(
        res,
        createErrorResponse(400, 'Invalid or expired token')
      );
    }

    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying email:', error);
    return sendErrorResponse(res);
  }
};
