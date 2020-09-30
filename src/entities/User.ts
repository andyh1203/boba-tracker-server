import { prop, getModelForClass, plugin, Ref } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
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

  @Field(() => [Boba])
  @prop({ ref: "Boba", default: [], autopopulate: true })
  public bobas: Ref<Boba>[];

  // @prop({ default: false })
  // confirmed?: boolean;

  @Field(() => [String])
  @prop({ref: "String", default: []})
  public likes?: String[]

  @Field()
  @prop()
  public createdAt?: Date;

  @Field()
  @prop()
  public updatedAt?: Date;
}

export const UserModel = getModelForClass(User, {
  schemaOptions: {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret.__v;
        delete ret._id;
      },
    },
  },
});
