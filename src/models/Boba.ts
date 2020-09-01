import { prop, getModelForClass } from "@typegoose/typegoose";
import { Field, ObjectType, Root } from "type-graphql";

@ObjectType()
export class Boba {
  @Field()
  @prop()
  public drinkName: string;

  @Field()
  @prop()
  public sugarLevel: string;

  @Field()
  @prop()
  public iceLevel: string;

  @Field()
  fullName(@Root() parent: Boba): string {
    return `${parent.drinkName} (sugar: ${parent.sugarLevel}, ice: ${parent.iceLevel})`;
  }

  //   @prop()
  //   public toppings: string[];

  //   @prop()
  //   public price: string;

  //   @prop()
  //   public size: string;

  //   @prop()
  //   public store: string;
}

export const BobaModel = getModelForClass(Boba);
