export const REQUIRED_ENV_VARS = [
  'PORT',
  'DATABASE_USER',
  'DATABASE_PASSWORD',
  'DATABASE_NAME',
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'FRONTEND_URL'
] as const;

export type RequiredEnvVar = (typeof REQUIRED_ENV_VARS)[number];
