import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { createUserSchema } from './dto/user.dto';
import * as userService from './user.service';
import { config } from '../../config';

export const createUserHandler = async (req: Request, res: Response) => {
  const parsed = createUserSchema.parse(req.body);
  const existing = await userService.findUserByUsername(parsed.username);
  if (existing) return res.status(409).json({ message: 'username already exists' });
  const user = await userService.createUser(parsed.username);
  const token = jwt.sign({ username: user.username }, config.jwtSecret, {
    subject: String(user.id),
    expiresIn: config.jwtExpiresIn
  });
  return res.status(201).json({ data: user, token });
};

export const getUserHandler = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id) || id <= 0) return res.status(400).json({ message: 'invalid id' });
  const user = await userService.getUserById(id);
  if (!user) return res.status(404).json({ message: 'user not found' });
  return res.json({ data: user });