import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { Prisma } from '../../generated/prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { createUser, getUserById, loginUser } from '../services/auth.service';
import { signAccessToken } from '../services/token.service';
import { createErrorResponse, sendErrorResponse } from '../utils/common';
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

export const register = async (req: Request, res: Response) => {
  const data = req.body as RegisterDto;

  const errors = validateRegisterDto(data);
  if (Object.keys(errors).length > 0) {
    return sendErrorResponse(res, VALIDATION_FAILED(errors));
  }

  try {
    await createUser(data);
    return res.status(201).json({ message: 'Registration successful' });
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

    const token = signAccessToken({ userId: user.id, email: user.email });

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
