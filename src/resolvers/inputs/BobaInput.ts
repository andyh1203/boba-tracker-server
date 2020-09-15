import { InputType, Field } from "type-graphql";

@InputType()
export class BobaInput {
  @Field()
  drinkName: string;

  @Field()
  sugarLevel: string;

  @Field()
  iceLevel: string;
}
