import { Response } from 'express';

interface ErrorOptions {
  statusCode?: number;
  message?: string;
  errors?: Record<string, string>;
}

export const sendErrorResponse = (
  res: Response,
  options: ErrorOptions = {}
) => {
  const {
    statusCode = 500,
    message = 'Internal server error',
    errors = {}
  } = options;
  return res.status(statusCode).json({ message, errors });
};

export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPasswordLength = (password: string) => password.length >= 8;
