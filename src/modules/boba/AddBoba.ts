import "reflect-metadata";

import { Mutation, Resolver, Arg } from "type-graphql";

import { Boba, BobaModel } from "../../models/Boba";
import { AddBobaInput } from "./add-boba/AddBobaInput";

@Resolver()
export class AddBobaResolver {
  @Mutation(() => Boba)
  async addBoba(
    @Arg("data") { drinkName, iceLevel, sugarLevel }: AddBobaInput
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
