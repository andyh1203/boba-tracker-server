import { prop, getModelForClass } from "@typegoose/typegoose";
import { Field, ObjectType, Root } from "type-graphql";

@ObjectType()
export class User {
  @Field()
  @prop()
  public firstName: string;

  @Field()
  @prop()
  public lastName: string;

  @Field()
  @prop()
  public email: string;

  @prop()
  public password: string;

  @Field()
  fullName(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }
}

export const UserModel = getModelForClass(User);
