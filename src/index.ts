import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import mongoose from "mongoose";
import { MONGODB_URI } from "./utils/config";
import * as logger from "./utils/logger";
import Express from "express";
import session from "express-session";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import cors from "cors";
import { COOKIE_NAME } from "./constants";

const setupDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    });
    logger.info("Connected to MongoDB");
  } catch (err) {
    logger.error(`Could not connect to MongoDB: ${err}`);
  }
};

const setupServer = async () => {
  const schema = await buildSchema({
    resolvers: [__dirname + "/resolvers/*.ts"],
    validate: false,
  });
  const redis = new Redis({ host: "localhost", port: 6379 });
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res, redis }),
  });
  const app = Express();
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );
  const RedisStore = connectRedis(session);
  app.use(
    session({
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      name: COOKIE_NAME,
      secret: "sekred",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365,
      },
    } as any)
  );

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });
  app.listen(4000, () => {
    console.log("server started on http://localhost:4000/graphql");
  });
};

const main = async () => {
  setupDB();
  setupServer();
};

main();
