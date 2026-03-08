import 'dotenv/config';
import Fastify from 'fastify';
// @ts-ignore
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import { pino } from 'pino';
import { Server } from 'socket.io';
import { authRoutes } from './modules/auth/auth.controller';
import { roomRoutes } from './modules/room/room.controller';
import { chatService } from './modules/chat/chat.service';

const logger = pino({
  transport: {
    target: 'pino-pretty',
  },
});

const fastify = Fastify({
  logger: logger as any,
});

async function main() {
  try {
    await fastify.register(cors, {
      origin: true, // Configurer plus précisément pour la prod
    });

    await fastify.register(fastifyJwt, {
      secret: process.env.JWT_ACCESS_SECRET || 'super-secret-key',
    });

    await fastify.register(authRoutes, { prefix: '/api/auth' });
    await fastify.register(roomRoutes, { prefix: '/api/rooms' });

    fastify.get('/health', async () => {
      return { status: 'ok', timestamp: new Date().toISOString() };
    });

    const port = Number(process.env.PORT) || 4000;
    await fastify.listen({ port, host: '0.0.0.0' });

    // Initialisation Socket.io
    const io = new Server(fastify.server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      logger.info(`Nouvelle connexion socket: ${socket.id}`);

      socket.on('join_room', (roomId: string) => {
        socket.join(roomId);
        logger.info(`Socket ${socket.id} a rejoint le salon: ${roomId}`);
      });

      socket.on('send_message', async (data: { content: string; roomId: string; userId: string }) => {
        try {
          const message = await chatService.saveMessage(data);
          io.to(data.roomId).emit('receive_message', {
            id: message.id,
            content: message.content,
            userId: message.userId,
            username: message.user.username || message.user.email,
            roomId: message.roomId,
            createdAt: message.createdAt,
          });
        } catch (error) {
          logger.error('Erreur lors de l\'envoi du message:', error);
        }
      });

      socket.on('disconnect', () => {
        logger.info(`Socket déconnecté: ${socket.id}`);
      });
    });

    logger.info(`Serveur démarré sur le port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();
