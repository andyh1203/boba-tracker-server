import "reflect-metadata";
import { COOKIE_NAME } from "../../constants";

import { Mutation, Resolver, Ctx } from "type-graphql";
import { MyContext } from "../../types/MyContext";

@Resolver()
export class LogoutUserResolver {
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
}
