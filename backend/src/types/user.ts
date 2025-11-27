export type User = {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  address?: string | null;
  contactNumber?: string | null;
  age?: number | null;
  createdAt: Date;
};

export type CreateUserInput = {
  fullName: string;
  email: string;
  password: string;
  address?: string | undefined;
  contactNumber?: string | undefined;
  age?: number | undefined;
};

export type PublicUser = Omit<User, 'passwordHash'>;

