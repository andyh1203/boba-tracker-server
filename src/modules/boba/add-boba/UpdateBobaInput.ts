import { Length } from "class-validator";
import { InputType, Field } from "type-graphql";

@InputType()
export class UpdateBobaInput {
  @Field({ nullable: true })
  @Length(1, 255)
  drinkName?: string;

  @Field({ nullable: true })
  @Length(1, 255)
  sugarLevel?: string;

  @Field({ nullable: true })
  @Length(1, 255)
  iceLevel?: string;
}
