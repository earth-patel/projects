import type { Request, Response } from 'express';

import { createUser } from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const user = await createUser({ name, email, password });

  res.status(201).json(user);
};