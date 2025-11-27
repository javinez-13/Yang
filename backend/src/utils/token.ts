import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { PublicUser } from '../types/user';

export type AuthTokenPayload = {
  sub: string;
  email: string;
  fullName: string;
};

export const signAuthToken = (user: PublicUser) =>
  jwt.sign(
    {
      email: user.email,
      fullName: user.fullName,
    },
    env.jwtSecret,
    {
      subject: user.id,
      expiresIn: '12h',
    },
  );

export const verifyAuthToken = (token: string) =>
  jwt.verify(token, env.jwtSecret) as AuthTokenPayload & jwt.JwtPayload;

