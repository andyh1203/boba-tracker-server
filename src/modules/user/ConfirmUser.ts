import { Mutation, Resolver, Arg, Ctx } from "type-graphql";
import { UserModel } from "../../models/User";
import { CONFIRM_USER_PREFIX } from "../../constants";
import { MyContext } from "../../types/MyContext";

@Resolver()
export class ConfirmUserResolver {
  @Mutation(() => Boolean)
  async confirmUser(
    @Arg("token") token: string,
    @Ctx() { redis }: MyContext
  ): Promise<boolean> {
    const userId = await redis.get(CONFIRM_USER_PREFIX + token);

    if (!userId) {
      return false;
    }

    await UserModel.update({ _id: userId }, { confirmed: true });
    await redis.del(token);

    return true;
  }
}
