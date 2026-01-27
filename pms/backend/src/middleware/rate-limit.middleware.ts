import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

/* ---------- LOGIN REQUESTS ---------- */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  keyGenerator: req => {
    return req.body.email || ipKeyGenerator(req.ip);
  },
  message: {
    message: 'Too many login attempts. Try again after 15 minutes.'
  }
});

/* ---------- GLOBAL API ---------- */
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    message: 'Too many requests. Slow down.'
  }
});
