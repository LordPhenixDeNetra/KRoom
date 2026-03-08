import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { authService } from './auth.service';
import { loginSchema, registerSchema } from '@kroom/shared-types';

export async function authRoutes(fastify: FastifyInstance) {
  // Register
  fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = registerSchema.parse(request.body);
    try {
      const user = await authService.register(body);
      const token = fastify.jwt.sign({ id: user.id, email: user.email });
      return reply.code(201).send({ user: { id: user.id, email: user.email, username: user.username }, token });
    } catch (error: any) {
      if (error.code === 'P2002') {
        return reply.code(400).send({ message: 'Email already exists' });
      }
      return reply.code(500).send({ message: 'Internal server error' });
    }
  });

  // Login
  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = loginSchema.parse(request.body);
    const user = await authService.validateUser(body);

    if (!user) {
      return reply.code(401).send({ message: 'Invalid credentials' });
    }

    const token = fastify.jwt.sign({ id: user.id, email: user.email });
    return reply.send({ user: { id: user.id, email: user.email, username: user.username }, token });
  });

  // Profile (Protected)
  fastify.get('/profile', {
    onRequest: [async (request) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        throw new Error('Unauthorized');
      }
    }]
  }, async (request: FastifyRequest) => {
    return request.user;
  });
}
