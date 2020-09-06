import { Mutation, Resolver, Arg, Ctx } from "type-graphql";
import { UserModel, User } from "../../models/User";
import { redis } from "../../redis";
import { forgotPasswordPrefix } from '../../constants/redisPrefixes'
import { ChangePasswordInput } from './change-password/ChangePasswordInput';
import bcrypt from "bcrypt";
import { MyContext } from "../../types/MyContext"

@Resolver()
export class ChangePasswordResolver {
    @Mutation(() => User, { nullable: true })
    async changePassword(
        @Arg("data") { token, password }: ChangePasswordInput,
        @Ctx() ctx: MyContext
    ): Promise<User | null> {
        const userId = await redis.get(forgotPasswordPrefix + token);
        if (!userId) {
            return null;
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return null
        }
        await redis.del(forgotPasswordPrefix + token);
        user.password = await bcrypt.hash(password, 12);
        await user.save();

        ctx.req.session!.userId = user.toJSON().id;
        return user;
    }
}
