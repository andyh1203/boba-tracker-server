import { Length } from "class-validator";
import { InputType, Field } from "type-graphql";

@InputType()
export class AddBobaInput {
  @Field()
  @Length(1, 255)
  drinkName: string;

  @Field()
  @Length(1, 255)
  sugarLevel: string;

  @Field()
  @Length(1, 255)
  iceLevel: string;

  @Field()
  userId: string;
}
