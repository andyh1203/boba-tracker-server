import { BaseBobaInput } from "../resolvers/inputs/BobaInput";
import { RegisterUserInput } from "../resolvers/inputs/UserInput";
import validator from "validator";
import { UserModel } from "../entities/User";

export const validateBoba = (options: BaseBobaInput) => {
  for (const [option, value] of Object.entries(options)) {
    if (!validator.isLength(value as string, { min: 1 })) {
      return [
        {
          type: "Validation",
          field: option,
          message: "Length must be greater than 1",
        },
      ];
    }
  }
  return null;
};

export const validatePassword = (password: string) => {
  if (!validator.isLength(password as string, { min: 8 })) {
    return [
      {
        type: "Validation",
        field: "password",
        message: "Length must be greater than 8",
      },
    ];
  }
  return null;
};

export const validateRegister = async ({
  firstName,
  lastName,
  email,
  password,
}: RegisterUserInput) => {
  const user = await UserModel.findOne({ email });
  if (user) {
    return [
      {
        type: "Validation",
        field: "email",
        message: "That email already exists",
      },
    ];
  }
  for (let option of [firstName, lastName]) {
    if (!validator.isLength(option, { min: 1 })) {
      return [
        {
          type: "Validation",
          field: option,
          message: "Length must be greater than 1",
        },
      ];
    }
  }
  if (!validator.isEmail(email)) {
    return [
      {
        type: "Validation",
        field: "email",
        message: "Not a valid email",
      },
    ];
  }
  const passwordError = validatePassword(password);
  if (passwordError) {
    return passwordError;
  }
  return null;
};
