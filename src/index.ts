import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import mongoose from "mongoose";
import { CORS_ORIGIN, MONGO_URL, PORT, REDIS_URL, SESSION_SECRET } from "./utils/config";
import * as logger from "./utils/logger";
import Express from "express";
import session from "express-session";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import cors from "cors";
import { COOKIE_NAME, __prod__ } from "./constants";

const setupDB = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    });
    logger.info(`Connected to MongoDB: ${MONGO_URL}`);
  } catch (err) {
    logger.error(`Could not connect to MongoDB: ${err}`);
  }
};

const setupServer = async () => {
  const schema = await buildSchema({
    resolvers: [__dirname + "/resolvers/*.ts", __dirname + "/resolvers/*.js"],
    validate: false,
  });
  const redis = new Redis(REDIS_URL);
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res, redis }),
  });
  const app = Express();
  app.set("trust proxy", 1)
  app.use(
    cors({
      credentials: true,
      origin: CORS_ORIGIN,
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
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: __prod__,
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365,
        sameSite: "lax",
        domain: __prod__ ? ".huynhandy.com" : undefined
      },
    } as any)
  );

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });
  app.listen(parseInt(PORT), () => {
    console.log(`server started on http://localhost:${PORT}/graphql`);
  });
};

const main = async () => {
  setupDB();
  setupServer();
};

main();
