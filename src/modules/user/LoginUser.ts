import "reflect-metadata";

import { Mutation, Resolver, Arg, Ctx } from "type-graphql";
import bcrypt from "bcrypt";
import { User, UserModel } from "../../models/User";
import { MyContext } from "../../types/MyContext";

@Resolver()
export class LoginUserResolver {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return null;
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return null;
    }

    ctx.req.session!.userId = user.toJSON().id;

    return user;
  }
}
