import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import mongoose from "mongoose";
import { MONGODB_URI } from "./utlils/config";
import * as logger from "./utlils/logger";
import { AddBobaResolver } from "./modules/boba/AddBoba";
import { ListBobaResolver } from "./modules/boba/ListBoba";
import { RegisterResolver } from "./modules/user/Register";

const setupDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    logger.info("Connected to MongoDB");
  } catch (err) {
    logger.error(`Could not connect to MongoDB: ${err}`);
  }
};

const setupApollo = async () => {
  const schema = await buildSchema({
    resolvers: [AddBobaResolver, ListBobaResolver, RegisterResolver],
  });
  const apolloServer = new ApolloServer({ schema });
  apolloServer.listen().then(({ url }) => {
    logger.info(`Server ready at ${url}`);
  });
};

const main = async () => {
  setupDB();
  setupApollo();
};

main();
