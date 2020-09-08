import "reflect-metadata";

import { Mutation, Resolver, Arg } from "type-graphql";
import bcrypt from "bcrypt";
import { User, UserModel } from "../../models/User";
import { RegisterUserInput } from "./register-user/RegisterUserInput";
import { sendEmail } from "../../utils/sendEmail";
import { createConfirmationUrl } from "../../utils/createConfirmationUrl";

@Resolver()
export class RegisterUserResolver {
  @Mutation(() => User)
  async register(
    @Arg("data") { firstName, lastName, email, password }: RegisterUserInput
  ): Promise<User> {
    console.log(firstName);
    console.log(lastName);
    console.log(email);
    console.log(password);
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
    await sendEmail(email, await createConfirmationUrl(user.toJSON().id));
    return user;
  }
}
