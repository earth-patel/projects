import { Request } from 'express';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: number;
  email: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
