import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';

import {
  isValidEmail,
  isValidPasswordLength,
  sendErrorResponse
} from '../common';
import { Prisma } from '../../generated/prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../prisma';
import { createUser, loginUser } from '../services/auth.service';

const INVALID_CREDENTIALS_ERROR = {
  statusCode: 401,
  message: 'Invalid email or password',
  errors: { form: 'Invalid email or password' }
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true
      }
    });

    if (!user) {
      return sendErrorResponse(res, {
        statusCode: 401,
        message: 'User not found',
        errors: { form: 'User not found. Please log in again.' }
      });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return sendErrorResponse(res);
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const errors: Record<string, string> = {};

  if (!email) errors.email = 'Email is required';
  else if (!isValidEmail(email)) errors.email = 'Invalid email format';

  if (!password) errors.password = 'Password is required';
  else if (!isValidPasswordLength(password))
    errors.password = 'Password must be at least 8 characters long';

  if (Object.keys(errors).length > 0) {
    return sendErrorResponse(res, {
      statusCode: 400,
      message: 'Validation failed',
      errors
    });
  }

  try {
    const user = await loginUser(email);
    if (!user) return sendErrorResponse(res, INVALID_CREDENTIALS_ERROR);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return sendErrorResponse(res, INVALID_CREDENTIALS_ERROR);

    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
      throw new Error('JWT configuration missing');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN } as SignOptions
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    return sendErrorResponse(res);
  }
};

export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  const errors: Record<string, string> = {};

  if (!firstName) errors.firstName = 'First name is required';
  if (!lastName) errors.lastName = 'Last name is required';

  if (!email) errors.email = 'Email is required';
  else if (!isValidEmail(email)) errors.email = 'Invalid email format';

  if (!password) errors.password = 'Password is required';
  else if (!isValidPasswordLength(password))
    errors.password = 'Password must be at least 8 characters long';

  if (Object.keys(errors).length > 0) {
    return sendErrorResponse(res, {
      statusCode: 400,
      message: 'Validation failed',
      errors
    });
  }

  try {
    await createUser({ firstName, lastName, email, password });
    return res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    // Handle unique constraint violation for email
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return sendErrorResponse(res, {
        statusCode: 400,
        message: 'Email already in use',
        errors: { email: 'Email already in use' }
      });
    }

    console.error('Error registering user:', error);
    return sendErrorResponse(res);
  }
};
