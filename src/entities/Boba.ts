import { prop, getModelForClass, Ref, plugin } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";
import { ObjectId } from "mongodb";
import autopopulate from "mongoose-autopopulate";

@ObjectType()
@plugin(autopopulate as any)
export class Boba {
  @Field(() => String)
  readonly _id: ObjectId;

  @Field()
  @prop({ required: true })
  public drinkName: string;

  @Field()
  @prop()
  public sugarLevel: string;

  @Field()
  @prop()
  public iceLevel: string;

  @Field(() => User)
  @prop({ ref: User, required: true, autopopulate: true })
  public user: Ref<User>;

  @Field(() => [String])
  @prop({ref: "String"})
  public likes: String[]

  @Field()
  @prop()
  public createdAt?: Date;

  @Field()
  @prop()
  public updatedAt?: Date;

  //   @prop()
  //   public toppings: string[];

  //   @prop()
  //   public price: string;

  //   @prop()
  //   public size: string;

  //   @prop()
  //   public store: string;
}

export const BobaModel = getModelForClass(Boba, {
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
