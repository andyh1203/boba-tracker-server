import "reflect-metadata";

import { Resolver, Query } from "type-graphql";

import { Boba, BobaModel } from "../../models/Boba";

@Resolver()
export class ListBobaResolver {
  @Query(() => [Boba])
  async bobas(): Promise<Boba[]> {
    const bobas = await BobaModel.find({}).populate("User");
    console.log(bobas);
    return bobas;
  }
}
