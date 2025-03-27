import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request } from 'express';
dotenv.config();

const secret = process.env.JWT_SECRET_KEY || 'mysecret';

export const context = ({ req }: { req: Request }) => {
  const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';
  if (token) {
    try {
      const user = jwt.verify(token, secret);
      return { user };
    } catch (error) {
      console.error('Invalid token', error);
    }
  }
  return {};
};
