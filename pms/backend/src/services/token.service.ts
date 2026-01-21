import jwt, { SignOptions } from 'jsonwebtoken';

export interface JwtPayload {
  userId: number;
  email: string;
}

const getJwtConfig = () => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN;
  return { secret, expiresIn };
};

export const signAccessToken = (payload: JwtPayload) => {
  const { secret, expiresIn } = getJwtConfig();
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

export const verifyAccessToken = (token: string) => {
  const { secret } = getJwtConfig();
  return jwt.verify(token, secret) as JwtPayload;
};
