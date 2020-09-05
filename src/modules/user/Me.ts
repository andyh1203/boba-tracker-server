import "reflect-metadata";

import { Query, Resolver, Ctx } from "type-graphql";
import { User, UserModel } from "../../models/User";
import { MyContext } from "../../types/MyContext";

@Resolver()
export class MeResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | null> {
    if (!ctx.req.session!.userId) {
      return null;
    }
    const user = await UserModel.findById(ctx.req.session!.userId);
    return user;
  }
}
