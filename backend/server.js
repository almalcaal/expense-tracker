import express from "express";
import http from "http";
import cors from "cors";

import { ApolloServer } from "@apollo/server";
// import { startStandaloneServer } from "@apollo/server/standalone";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import fusedTypeDefs from "./typeDefs/index.js";
import fusedResolvers from "./resolvers/index.js";

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs: fusedTypeDefs,
  resolvers: fusedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// ensures we wait for our server to start
await server.start();

// set up our express middleware to handle CORS, body parsing, and our expressMiddleware function
app.use(
  "/",
  cors(),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req }) => ({ req }),
  })
);

// modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

console.log(`Server ready at http://localhost:4000/`);

// const { url } = await startStandaloneServer(server);
// console.log(`Server ready at ${url}`);
