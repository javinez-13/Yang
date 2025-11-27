import jwt from 'jsonwebtoken';
import { PublicUser } from '../types/user';
export type AuthTokenPayload = {
    sub: string;
    email: string;
    fullName: string;
};
export declare const signAuthToken: (user: PublicUser) => string;
export declare const verifyAuthToken: (token: string) => AuthTokenPayload & jwt.JwtPayload;
//# sourceMappingURL=token.d.ts.map