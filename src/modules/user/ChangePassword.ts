import { Mutation, Resolver, Arg, Ctx } from "type-graphql";
import { UserModel, User } from "../../models/User";
import { FORGOT_PASSWORD_PREFIX } from "../../constants";
import { ChangePasswordInput } from "./change-password/ChangePasswordInput";
import bcrypt from "bcrypt";
import { MyContext } from "../../types/MyContext";

@Resolver()
export class ChangePasswordResolver {
  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg("data") { token, password }: ChangePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const userId = await ctx.redis.get(FORGOT_PASSWORD_PREFIX + token);
    if (!userId) {
      return null;
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return null;
    }
    await ctx.redis.del(FORGOT_PASSWORD_PREFIX + token);
    user.password = await bcrypt.hash(password, 12);
    await user.save();

    ctx.req.session!.userId = user.toJSON().id;
    return user;
  }
}
