import { prop, getModelForClass, plugin, Ref } from "@typegoose/typegoose";
import { Field, ObjectType, Root } from "type-graphql";
import { ObjectId } from "mongodb";
import { Boba } from "./Boba";
import autopopulate from "mongoose-autopopulate";

@ObjectType()
@plugin(autopopulate as any)
export class User {
  @Field(() => String)
  readonly _id: ObjectId;

  @Field()
  @prop({ required: true })
  public firstName: string;

  @Field()
  @prop({ required: true })
  public lastName: string;

  @Field()
  @prop({ required: true })
  public email: string;

  @prop({ required: true })
  public password: string;

  @Field()
  fullName(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Field(() => [Boba])
  @prop({ ref: "Boba", default: [], autopopulate: true })
  public bobas: Ref<Boba>[];

  @prop({ default: false })
  confirmed?: boolean;
}

export const UserModel = getModelForClass(User, {
  schemaOptions: {
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret.__v;
        delete ret._id;
      },
    },
  },
});
