import { prisma } from '../../shared/prisma';
import { ChatMessage } from '@kroom/shared-types';

export class ChatService {
  async saveMessage(data: { content: string; userId: string; roomId: string }) {
    return prisma.message.create({
      data: {
        content: data.content,
        userId: data.userId,
        roomId: data.roomId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          }
        }
      }
    });
  }

  async getMessagesByRoom(roomId: string, limit = 50) {
    return prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: 'asc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          }
        }
      }
    });
  }
}

export const chatService = new ChatService();
