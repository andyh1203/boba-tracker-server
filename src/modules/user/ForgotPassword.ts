import { Mutation, Resolver, Arg } from "type-graphql";
import { UserModel } from "../../models/User";
import { redis } from "../../redis";
import { sendEmail } from "../../utils/sendEmail"
import { v4 } from 'uuid';
import { forgotPasswordPrefix } from '../../constants/redisPrefixes'

@Resolver()
export class ForgotPassword {
    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg("email") email: string,
    ): Promise<boolean> {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return true
        }
        const token = v4();
        await redis.set(forgotPasswordPrefix + token, user.toJSON().id, "ex", 60 * 60 * 24); // 1 day expiration
        await sendEmail(email, `http://localhost:3000/user/change-password/${token}`)

        return true
    }
}
