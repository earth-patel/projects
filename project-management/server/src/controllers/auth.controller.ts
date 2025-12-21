import type { Request, Response } from 'express';

import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';

import { createUser } from '../services/auth.service';
import { loginUser } from '../services/auth.service';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // fetch user from DB
    const user = await loginUser(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
      throw new Error("JWT_SECRET or JWT_EXPIRES_IN is not defined");
    }

    // generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN } as SignOptions
    );

    // success
    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const register = async (req: Request, res: Response) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const user = await createUser({ name, email, password });

  res.status(201).json(user);
};