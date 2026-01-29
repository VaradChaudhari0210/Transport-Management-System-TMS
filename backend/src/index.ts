import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './schema/resolvers';
import { getAuthContext } from './utils/auth';
import { createLoaders, queryComplexityPlugin } from './utils/dataloader';

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

const app = express();
const PORT = process.env.PORT || 4000;

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [queryComplexityPlugin],
    introspection: true, // Enable for GraphQL Playground
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: '*', // In production, specify exact origins
      credentials: true,
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = await getAuthContext(req, prisma);
        const loaders = createLoaders(prisma);
        
        return {
          prisma,
          auth,
          loaders,
        };
      },
    })
  );

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    console.log(`📊 Health check at http://localhost:${PORT}/health`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
