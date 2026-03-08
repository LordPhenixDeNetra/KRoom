import 'dotenv/config';
import Fastify from 'fastify';
// @ts-ignore
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import { pino } from 'pino';
import { authRoutes } from './modules/auth/auth.controller';
import { roomRoutes } from './modules/room/room.controller';

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
    
    console.log(`🚀 Server ready at http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();
