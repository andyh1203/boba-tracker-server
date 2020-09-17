import {
  Mutation,
  Resolver,
  Arg,
  Query,
  Ctx,
  UseMiddleware,
  Int,
  FieldResolver,
  Root,
} from "type-graphql";

import { BobaModel, Boba } from "../entities/Boba";
import { UserModel } from "..//entities/User";

import { validateBoba } from "../utils/validateInputs";
import { BobaInput } from "./inputs/BobaInput";
import { BobaResponse } from "./responseTypes";
import { MyContext } from "src/types";
import { isAuth } from "../middleware/isAuth";

@Resolver(Boba)
export class BobaResolver {
  @FieldResolver(() => String)
  drinkDescription(@Root() root: Boba) {
    return `Sugar: ${root.sugarLevel}, Ice: ${root.iceLevel}`;
  }

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
  async bobas(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ) {
    const realLimit = Math.min(limit, 20);
    const filter = cursor ? { createdAt: { $lt: new Date(cursor) } } : {};
    const bobas = await BobaModel.find(filter)
      .limit(realLimit)
      .sort("-createdAt")
      .populate("User");
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
