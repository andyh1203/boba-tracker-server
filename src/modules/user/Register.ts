import "reflect-metadata";

import { Mutation, Resolver, Arg } from "type-graphql";
import bcrypt from "bcrypt";
import { User, UserModel } from "../../models/User";
import { RegisterInput } from "./register/RegisterInput";

@Resolver()
export class RegisterResolver {
  @Mutation(() => User)
  async register(
    @Arg("data") { firstName, lastName, email, password }: RegisterInput
  ): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    user.save();
    return user;
  }
}
