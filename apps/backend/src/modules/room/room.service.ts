import slugify from 'slugify';
import { prisma } from '../../shared/prisma';
import { CreateRoomRequest } from '@kroom/shared-types';
import { generateLiveKitToken } from '../../shared/livekit';

export class RoomService {
  async createRoom(data: CreateRoomRequest, ownerId: string) {
    const slug = slugify(data.name, { lower: true, strict: true }) + '-' + Math.random().toString(36).substring(2, 7);
    
    return prisma.room.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        isPrivate: data.isPrivate,
        password: data.password, // À hacher en prod réelle pour la sécurité
        ownerId,
      },
    });
  }

  async getAllRooms() {
    return prisma.room.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
          }
        },
        _count: {
          select: { participants: true }
        }
      }
    });
  }

  async getRoomBySlug(slug: string) {
    return prisma.room.findUnique({
      where: { slug },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
          }
        }
      }
    });
  }

  async generateToken(roomSlug: string, userId: string, username: string) {
    const room = await this.getRoomBySlug(roomSlug);
    if (!room) throw new Error('Room not found');

    const token = generateLiveKitToken(roomSlug, username || userId);
    
    return {
      token,
      serverUrl: process.env.LIVEKIT_URL || 'http://localhost:7880',
    };
  }
}

export const roomService = new RoomService();
