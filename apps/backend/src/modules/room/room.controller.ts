import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { roomService } from './room.service';
import { chatService } from '../chat/chat.service';
import { createRoomSchema, joinRoomSchema } from '@kroom/shared-types';

export async function roomRoutes(fastify: FastifyInstance) {
  // Middlware simple pour vérifier le JWT
  fastify.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ message: 'Unauthorized' });
    }
  });

  // Créer un salon
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = createRoomSchema.parse(request.body);
    const userId = (request.user as any).id;
    
    try {
      const room = await roomService.createRoom(body, userId);
      return reply.code(201).send(room);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ message: 'Error creating room' });
    }
  });

  // Lister tous les salons
  fastify.get('/', async (request: FastifyRequest) => {
    return roomService.getAllRooms();
  });

  // Obtenir un salon par son slug
  fastify.get('/:slug', async (request: FastifyRequest, reply: FastifyReply) => {
    const { slug } = request.params as { slug: string };
    const room = await roomService.getRoomBySlug(slug);
    
    if (!room) {
      return reply.code(404).send({ message: 'Room not found' });
    }
    
    return room;
  });

  // Générer un token LiveKit pour rejoindre un salon
  fastify.post('/:slug/join', async (request: FastifyRequest, reply: FastifyReply) => {
    const { slug } = request.params as { slug: string };
    const { password } = (request.body as any) || {};
    const userId = (request.user as any).id;
    const username = (request.user as any).username || (request.user as any).email;

    const room = await roomService.getRoomBySlug(slug);
    if (!room) {
      return reply.code(404).send({ message: 'Room not found' });
    }

    if (room.isPrivate && room.password !== password) {
      return reply.code(403).send({ message: 'Invalid password for this private room' });
    }

    const data = await roomService.generateToken(slug, userId, username);
    return reply.send(data);
  });

  // Obtenir l'historique des messages d'un salon
  fastify.get('/:roomId/messages', async (request: FastifyRequest, reply: FastifyReply) => {
    const { roomId } = request.params as { roomId: string };
    try {
      const messages = await chatService.getMessagesByRoom(roomId);
      return messages.map(m => ({
        id: m.id,
        content: m.content,
        userId: m.userId,
        username: m.user.username || m.user.email,
        roomId: m.roomId,
        createdAt: m.createdAt,
      }));
    } catch (error) {
      return reply.code(500).send({ message: 'Error fetching messages' });
    }
  });
}
