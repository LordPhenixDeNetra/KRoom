import 'dotenv/config';
import Fastify from 'fastify';
// @ts-ignore
import cors from '@fastify/cors';
import { pino } from 'pino';

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
