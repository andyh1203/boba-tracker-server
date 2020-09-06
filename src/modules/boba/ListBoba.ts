import "reflect-metadata";
import { isAuth } from "../../middleware/isAuth";
import { Resolver, Query, UseMiddleware } from "type-graphql";

import { Boba, BobaModel } from "../../models/Boba";

@Resolver()
export class ListBobaResolver {
  @Query(() => [Boba])
  @UseMiddleware(isAuth)
  async bobas(): Promise<Boba[]> {
    const bobas = await BobaModel.find({}).populate("User");
    return bobas;
  }
}
