import { ZodError, z } from 'zod';
import { UserRepository } from '../repositories/userRepository';
import { hashPassword, comparePassword } from '../utils/password';
import { signAuthToken } from '../utils/token';
import { CreateUserInput } from '../types/user';

const signupSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  address: z.string().optional(),
  contactNumber: z.string().optional(),
  age: z.number().int().positive().max(120).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export class AuthService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async signup(input: CreateUserInput) {
    let payload: CreateUserInput;
    try {
      payload = signupSchema.parse(input);
    } catch (error) {
      throw new Error((error as ZodError).issues.map((issue) => issue.message).join(', '));
    }

    const existing = await this.userRepository.findByEmail(payload.email);
    if (existing) {
      throw new Error('Email is already registered');
    }

    const passwordHash = await hashPassword(payload.password);
    const user = await this.userRepository.createUser({
      ...payload,
      passwordHash,
    });

    const token = signAuthToken(this.userRepository.toPublic(user));

    return {
      token,
      user: this.userRepository.toPublic(user),
    };
  }

  async login(input: Pick<CreateUserInput, 'email' | 'password'>) {
    let payload: { email: string; password: string };
    try {
      payload = loginSchema.parse(input);
    } catch (error) {
      throw new Error((error as ZodError).issues.map((issue) => issue.message).join(', '));
    }

    const user = await this.userRepository.findByEmail(payload.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValid = await comparePassword(payload.password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    const token = signAuthToken(this.userRepository.toPublic(user));

    return {
      token,
      user: this.userRepository.toPublic(user),
    };
  }
}

