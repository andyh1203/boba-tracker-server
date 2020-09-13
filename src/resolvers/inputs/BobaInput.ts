import { InputType, Field } from "type-graphql";

@InputType()
export class BaseBobaInput {
  @Field()
  drinkName: string;

  @Field()
  sugarLevel: string;

  @Field()
  iceLevel: string;
}

@InputType()
export class AddBobaInput extends BaseBobaInput {
  @Field()
  userId: string;
}
