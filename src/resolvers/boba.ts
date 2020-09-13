import { Mutation, Resolver, Arg, Query } from "type-graphql";

import { BobaModel } from "../entities/Boba";
import { UserModel } from "..//entities/User";

import { validateBoba } from "../utils/validateInputs";
import { AddBobaInput, BaseBobaInput } from "./inputs/BobaInput";
import { BobaResponse, BobasResponse } from "./responseTypes";

@Resolver()
export class BobaResolver {
  @Mutation(() => BobaResponse)
  async addBoba(
    @Arg("data") { drinkName, iceLevel, sugarLevel, userId }: AddBobaInput
  ): Promise<BobaResponse> {
    const errors = validateBoba({ drinkName, iceLevel, sugarLevel });
    if (errors) {
      return { errors };
    }
    const boba = new BobaModel({
      drinkName,
      iceLevel,
      sugarLevel,
      user: userId,
    });
    const user = await UserModel.findById(userId);
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
  async deleteBoba(@Arg("bobaId") bobaId: string): Promise<Boolean> {
    const boba = await BobaModel.findById(bobaId);
    if (!boba) {
      return false;
    }
    await boba.deleteOne();
    return true;
  }

  @Query(() => BobasResponse)
  async bobas(): Promise<BobasResponse> {
    const bobas = await BobaModel.find({}).populate("User");
    return { bobas };
  }

  @Mutation(() => BobaResponse)
  async updateBoba(
    @Arg("bobaId") bobaId: string,
    @Arg("updatedInput") updatedInput: BaseBobaInput
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
