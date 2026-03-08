import bcrypt from 'bcrypt';
import { prisma } from '../../shared/prisma';
import { LoginRequest } from '@kroom/shared-types';

export class AuthService {
  async register(data: LoginRequest & { username?: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    return prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        username: data.username,
      },
    });
  }

  async validateUser(data: LoginRequest) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }
}

export const authService = new AuthService();
