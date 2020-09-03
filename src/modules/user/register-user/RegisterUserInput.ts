import { Length, IsEmail, MinLength } from "class-validator";
// import { Boba } from "src/models/Boba";
import { InputType, Field } from "type-graphql";
import { IsEmailAlreadyExist } from "./isEmailAlreadyExist";

@InputType()
export class RegisterUserInput {
  @Field()
  @Length(1, 255)
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;

  @Field()
  @Length(1, 255)
  @IsEmail()
  @IsEmailAlreadyExist({ message: "email already exists" })
  email: string;

  @Field()
  @MinLength(8)
  password: string;
}
