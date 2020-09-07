import { Mutation, Resolver, Arg } from "type-graphql";
import { UpdateBobaInput } from "./add-boba/UpdateBobaInput";

import { Boba, BobaModel } from "../../models/Boba";

@Resolver()
export class UpdateBobaResolver {
  @Mutation(() => Boba)
  async updateBoba(
    @Arg("bobaId") bobaId: string,
    @Arg("updatedInput") updatedInput: UpdateBobaInput
  ): Promise<Boba | null> {
    const updatedboba = await BobaModel.findByIdAndUpdate(
      bobaId,
      updatedInput,
      { new: true }
    );
    if (!updatedboba) {
      throw Error(`Boba ${bobaId} does not exist`);
    }
    return updatedboba;
  }
}
