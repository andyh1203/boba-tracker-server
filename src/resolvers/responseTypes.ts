import { Boba } from "../entities/Boba";
import { User } from "../entities/User";

import { Field, ObjectType } from "type-graphql";
@ObjectType()
class FieldError {
  @Field()
  type: string;
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
export class BobaResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Boba, { nullable: true })
  boba?: Boba;
}
@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class UsersResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => [User], { nullable: true })
  users?: User[];
}
