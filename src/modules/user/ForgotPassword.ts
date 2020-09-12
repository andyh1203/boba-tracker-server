import { Mutation, Resolver, Arg, Ctx } from "type-graphql";
import { UserModel } from "../../models/User";
import { sendEmail } from "../../utils/sendEmail";
import { v4 } from "uuid";
import { FORGOT_PASSWORD_PREFIX } from "../../constants";
import { MyContext } from "src/types/MyContext";

@Resolver()
export class ForgotPassword {
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ): Promise<boolean> {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return true;
    }
    const token = v4();
    await redis.set(
      FORGOT_PASSWORD_PREFIX + token,
      user.toJSON().id,
      "ex",
      1000 * 60 * 60 * 24 * 3
    ); // 3 day expiration

    await sendEmail(
      email,
      "Change Password",
      `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
    );

    return true;
  }
}
