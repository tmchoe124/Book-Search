import express from 'express';
import path from 'node:path';
import { ApolloServer } from 'apollo-server-express';
import db from './config/connection.js';
import routes from './routes/index.js';
import { typeDefs } from './schemas/typeDefs.js';
import { resolvers } from './schemas/resolvers.js';
import { context } from './context.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers, context });
  await server.start();
  (server as any).applyMiddleware({ app });

  if (process.env.NODE_ENV === 'production') {
    const clientDist = path.join(__dirname, '../../client/dist');
    app.use(express.static(clientDist));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  }

  app.use(routes);

  db.once('open', () => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🌍 Server listening at http://localhost:${PORT}`);
      console.log(`🚀 GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}

startApolloServer();