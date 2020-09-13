import { Mutation, Resolver, Arg, Ctx, Query } from "type-graphql";
import { UserModel, User } from "../entities/User";
import argon2 from "argon2";
import { MyContext } from "../types";
import {
  CONFIRM_USER_PREFIX,
  COOKIE_NAME,
  FORGOT_PASSWORD_PREFIX,
} from "../constants";
import { v4 } from "uuid";
import { sendEmail } from "../utils/sendEmail";
import { UserResponse, UsersResponse } from "./responseTypes";
import { validatePassword, validateRegister } from "../utils/validateInputs";
import { RegisterUserInput } from "./inputs/UserInput";

@Resolver()
export class UserResolver {
  @Query(() => UsersResponse)
  async users() {
    const users = await UserModel.find({}).populate("Bobas");
    return { users };
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    if (!req.session!.userId) {
      return null;
    }
    const user = await UserModel.findById(req.session!.userId);
    return user;
  }

  @Mutation(() => UserResponse, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return null;
    }

    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      return null;
    }

    if (!user.confirmed) {
      return null;
    }

    ctx.req.session!.userId = user.toJSON().id;

    return { user };
  }

  @Mutation(() => UserResponse, { nullable: true })
  async changePassword(
    @Arg("token") token: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ) {
    const errors = validatePassword(password);
    if (errors) {
      return { errors };
    }

    const userId = await ctx.redis.get(FORGOT_PASSWORD_PREFIX + token);
    if (!userId) {
      return {
        errors: [
          { type: "TokenExpired", field: "password", message: "Token expired" },
        ],
      };
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return null;
    }
    await ctx.redis.del(FORGOT_PASSWORD_PREFIX + token);
    user.password = await argon2.hash(password);
    await user.save();

    ctx.req.session!.userId = user.toJSON().id;
    return { user };
  }

  @Mutation(() => Boolean)
  async confirmUser(@Arg("token") token: string, @Ctx() { redis }: MyContext) {
    const userId = await redis.get(CONFIRM_USER_PREFIX + token);

    if (!userId) {
      return false;
    }

    await UserModel.updateOne({ _id: userId }, { confirmed: true });
    await redis.del(token);

    return true;
  }

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

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      req.session!.destroy((err) => {
        if (err) {
          console.log(err);
          return reject(false);
        }
        res?.clearCookie(COOKIE_NAME);
        return resolve(true);
      });
    });
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("data") { firstName, lastName, email, password }: RegisterUserInput,
    @Ctx() { redis }: MyContext
  ) {
    const errors = await validateRegister({
      firstName,
      lastName,
      email,
      password,
    });
    console.log(errors);
    if (errors) {
      return { errors };
    }

    const passwordHash = await argon2.hash(password);
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
      `<a href="http://localhost:3000/confirm/${token}">confirm</a>`
    );
    return { user };
  }
}
