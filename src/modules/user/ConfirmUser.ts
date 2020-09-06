import { Mutation, Resolver, Arg } from "type-graphql";
import { UserModel } from "../../models/User";
import { redis } from "../../redis";
import { confirmUserPrefix } from "../../constants/redisPrefixes"

@Resolver()
export class ConfirmUserResolver {
    @Mutation(() => Boolean)
    async confirmUser(
        @Arg("token") token: string,
    ): Promise<boolean> {
        const userId = await redis.get(confirmUserPrefix + token);

        if (!userId) {
            return false;
        }

        await UserModel.update({ _id: userId }, { confirmed: true });
        await redis.del(token);

        return true
    }
}
