import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema, Mutation, Query, Resolver, Arg } from "type-graphql";
import mongoose from "mongoose";
import { MONGODB_URI } from "./utlils/config";
import * as logger from "./utlils/logger";
import { Boba, BobaModel } from "./models/Boba";

@Resolver()
class HelloResolver {
  @Query(() => String)
  async hello() {
    return "Hello World!";
  }

  @Mutation(() => Boba)
  async addBoba(
    @Arg("drinkName") drinkName: string,
    @Arg("sugarLevel") sugarLevel: string,
    @Arg("iceLevel") iceLevel: string
  ): Promise<Boba> {
    const boba = await BobaModel.create({
      drinkName,
      iceLevel,
      sugarLevel,
    });
    boba.save();
    return boba;
  }
}

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
    resolvers: [HelloResolver],
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
