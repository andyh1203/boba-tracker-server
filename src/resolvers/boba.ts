import {
  Mutation,
  Resolver,
  Arg,
  Query,
  Ctx,
  UseMiddleware,
} from "type-graphql";

import { BobaModel, Boba } from "../entities/Boba";
import { UserModel } from "..//entities/User";

import { validateBoba } from "../utils/validateInputs";
import { BobaInput } from "./inputs/BobaInput";
import { BobaResponse } from "./responseTypes";
import { MyContext } from "src/types";
import { isAuth } from "../middleware/isAuth";

@Resolver()
export class BobaResolver {
  @Mutation(() => BobaResponse)
  @UseMiddleware(isAuth)
  async addBoba(
    @Arg("data") { drinkName, iceLevel, sugarLevel }: BobaInput,
    @Ctx() { req }: MyContext
  ): Promise<BobaResponse> {
    const errors = validateBoba({ drinkName, iceLevel, sugarLevel });
    if (errors) {
      return { errors };
    }
    const boba = new BobaModel({
      drinkName,
      iceLevel,
      sugarLevel,
      user: req.session?.userId,
    });
    const user = await UserModel.findById(req.session?.userId);
    if (user) {
      const savedBoba = await boba.save();
      user.bobas = [...user.bobas, savedBoba._id];
      await user.save();
    } else {
      return {
        errors: [
          { type: "UserNotFound", field: "_id", message: "User not found" },
        ],
      };
    }
    return { boba };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteBoba(@Arg("bobaId") bobaId: string): Promise<Boolean> {
    const boba = await BobaModel.findById(bobaId);
    if (!boba) {
      return false;
    }
    await boba.deleteOne();
    return true;
  }

  @Query(() => [Boba])
  async bobas() {
    const bobas = await BobaModel.find({}).populate("User");
    return bobas;
  }

  @Mutation(() => BobaResponse)
  @UseMiddleware(isAuth)
  async updateBoba(
    @Arg("bobaId") bobaId: string,
    @Arg("updatedInput") updatedInput: BobaInput
  ): Promise<BobaResponse | null> {
    const errors = validateBoba(updatedInput);
    if (errors) {
      return { errors };
    }
    const updatedboba = await BobaModel.findByIdAndUpdate(
      bobaId,
      updatedInput,
      { new: true }
    );
    if (!updatedboba) {
      return {
        errors: [
          { type: "BobaNotFound", field: "_id", message: "Boba not found" },
        ],
      };
    }
    return updatedboba;
  }
}
