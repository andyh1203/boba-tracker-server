import { Mutation, Resolver, Arg } from "type-graphql";

import { BobaModel } from "../../models/Boba";

@Resolver()
export class DeleteBobaResolver {
  @Mutation(() => Boolean)
  async deleteBoba(@Arg("bobaId") bobaId: string): Promise<Boolean> {
    const boba = await BobaModel.findById(bobaId);
    if (!boba) {
      return false;
    }
    await boba.deleteOne();
    return true;
  }
}
