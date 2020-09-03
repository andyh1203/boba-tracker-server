import "reflect-metadata";

import { Resolver, Query } from "type-graphql";

import { User, UserModel } from "../../models/User";

@Resolver()
export class ListUserResolver {
  @Query(() => [User])
  async users(): Promise<User[]> {
    const users = await UserModel.find({}).populate("Bobas");
    return users;
  }
}
