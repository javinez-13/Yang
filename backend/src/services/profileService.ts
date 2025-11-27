import { UserRepository } from '../repositories/userRepository';

export class ProfileService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return this.userRepository.toPublic(user);
  }

  async updateProfile(
    userId: string,
    data: Partial<{ fullName: string; address: string; contactNumber: string; age: number }>,
  ) {
    const updated = await this.userRepository.updateProfile(userId, data);
    if (!updated) {
      throw new Error('Unable to update profile');
    }
    return updated;
  }
}

