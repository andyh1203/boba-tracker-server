import "reflect-metadata";

import { Mutation, Resolver, Arg, Ctx } from "type-graphql";
import bcrypt from "bcrypt";
import { User, UserModel } from "../../models/User";
import { RegisterUserInput } from "./register-user/RegisterUserInput";
import { sendEmail } from "../../utils/sendEmail";

import { CONFIRM_USER_PREFIX } from "../../constants";
import { MyContext } from "src/types/MyContext";
import { v4 } from "uuid";

@Resolver()
export class RegisterUserResolver {
  @Mutation(() => User)
  async register(
    @Arg("data") { firstName, lastName, email, password }: RegisterUserInput,
    @Ctx() { redis }: MyContext
  ): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password: passwordHash,
      bobas: [],
      confirmed: false,
    });
    user.save();

    const token = v4();
    await redis.set(
      CONFIRM_USER_PREFIX + token,
      user.toJSON().id,
      "ex",
      60 * 60 * 24
    );

    await sendEmail(
      email,
      "Confirmation Email",
      `http://localhost:3000/confirm/${token}`
    );
    return user;
  }
}
