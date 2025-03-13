import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";

import { ApolloServer } from "@apollo/server";
// import { startStandaloneServer } from "@apollo/server/standalone";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import { buildContext } from "graphql-passport";

import fusedTypeDefs from "./typeDefs/index.js";
import fusedResolvers from "./resolvers/index.js";

import { connectDB } from "./lib/db.js";
import { configurePassport } from "./passport/passport.config.js";

dotenv.config();
configurePassport();

const __dirname = path.resolve();

const app = express();
const httpServer = http.createServer(app);

const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});
store.on("error", (err) => console.log(err));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // false to prevent a new session save at every request, preventing multiple sessions for single user
    saveUninitialized: false, //false to prevent db from saving uninitialized sessions
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
    },
    store: store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
  typeDefs: fusedTypeDefs,
  resolvers: fusedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// ensures we wait for our server to start
await server.start();

// set up our express middleware to handle CORS, body parsing, and our expressMiddleware function
app.use(
  "/graphql",
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }),
  })
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  // any route that is not api will be redirected to index.html
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDB();

console.log(`Server ready at http://localhost:4000/graphql`);

// const { url } = await startStandaloneServer(server);
// console.log(`Server ready at ${url}`);
