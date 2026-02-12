import type { Request, Response } from 'express';

import { AuthRequest, LoginDto, RegisterDto } from '../dtos/auth.dto';
import { Prisma } from '../../generated/prisma/client';
import {
  forgotPasswordByEmail,
  getUserById,
  registerUserWithOrganization,
  resendVerificationEmailByEmail,
  resetPasswordByToken,
  validateLogin,
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

/* ---------- CONTROLLERS ---------- */
export const register = async (req: Request, res: Response) => {
  const data = req.body as RegisterDto;

  const errors = validateRegisterDto(data);
  if (Object.keys(errors).length > 0) {
    return sendErrorResponse(res, VALIDATION_FAILED(errors));
  }

  try {
    await registerUserWithOrganization(data);
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
      return sendErrorResponse(
        res,
        createErrorResponse(400, 'Email already in use', {
          email: 'Email already in use'
        })
      );
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
    const user = await validateLogin(data.email, data.password);
    if (!user)
      return sendErrorResponse(
        res,
        createErrorResponse(401, 'Invalid email or password', {
          form: 'Invalid email or password'
        })
      );

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
    const userId = req.user?.userId;
    if (!userId) {
      return sendErrorResponse(
        res,
        createErrorResponse(401, 'Unauthorized', {
          form: 'Unauthorized access. Please try logging in again'
        })
      );
    }

    const user = await getUserById(userId);
    if (!user) {
      return sendErrorResponse(
        res,
        createErrorResponse(401, 'User not found', {
          form: 'User not found'
        })
      );
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return sendErrorResponse(res);
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query as { token?: string };

  if (!token) {
    return sendErrorResponse(
      res,
      createErrorResponse(400, 'Invalid or missing token', {
        form: 'Invalid or missing token'
      })
    );
  }

  try {
    const user = await verifyEmailByToken(token);

    if (!user)
      return sendErrorResponse(
        res,
        createErrorResponse(400, 'Invalid or expired token', {
          form: 'Invalid or expired token'
        })
      );

    return res.status(200).json({ message: 'Email verified successfully.' });
  } catch (error) {
    console.error('Error verifying email:', error);
    return sendErrorResponse(res);
  }
};

export const resendVerificationEmail = async (req: Request, res: Response) => {
  const { email } = req.body as { email?: string };

  if (!email)
    return sendErrorResponse(
      res,
      createErrorResponse(400, 'Email is required', {
        email: 'Email is required'
      })
    );

  try {
    const result = await resendVerificationEmailByEmail(email);

    if (!result)
      return sendErrorResponse(
        res,
        createErrorResponse(404, 'Account not found', {
          email: 'Account not found'
        })
      );

    if (result === 'EMAIL_ALREADY_VERIFIED') {
      return sendErrorResponse(
        res,
        createErrorResponse(400, 'Email already verified', {
          email: 'Email already verified'
        })
      );
    }

    return res
      .status(200)
      .json({ message: 'Verification email resent successfully.' });
  } catch (error) {
    console.error('Error resending verification email:', error);
    return sendErrorResponse(res);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body as { email?: string };

  if (!email)
    return sendErrorResponse(
      res,
      createErrorResponse(400, 'Email is required', {
        email: 'Email is required'
      })
    );

  try {
    const result = await forgotPasswordByEmail(email);

    if (!result)
      return sendErrorResponse(
        res,
        createErrorResponse(404, 'Account not found', {
          email: 'Account not found'
        })
      );

    return res
      .status(200)
      .json({ message: 'A reset link has been sent to your email address.' });
  } catch (error) {
    console.error('Error processing forgot password:', error);
    return sendErrorResponse(res);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body as {
    token?: string;
    password?: string;
  };

  if (!token || !password) {
    return sendErrorResponse(
      res,
      createErrorResponse(400, 'Token and password are required', {
        form: 'Token and password are required'
      })
    );
  }

  try {
    const result = await resetPasswordByToken(token, password);

    if (!result) {
      return sendErrorResponse(
        res,
        createErrorResponse(400, 'Invalid or expired token', {
          form: 'Invalid or expired token'
        })
      );
    }

    return res.status(200).json({ message: 'Password reset successful.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return sendErrorResponse(res);
  }
};
