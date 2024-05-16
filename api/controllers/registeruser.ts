import { Collection } from "mongodb";
import { UsersModel } from "../mongo.ts";
import { hash } from "@denorg/scrypt";

export enum REGISTER_EXCEPTIONS {
  USER_ALREADY_EXISTS = "User already exists",
  UNEXPECTED_ERROR = "Unexpected error",
}

const registerUser = async (
  UsersCollection: Collection<UsersModel>,
  email: string,
  password: string,
  name: string
) => {
  try {
    const user = await UsersCollection.findOne({ email });
    if (user) {
      throw new Error(REGISTER_EXCEPTIONS.USER_ALREADY_EXISTS);
    }

    // hash password
    const hashedPassword = await hash(password);

    const newUser = await UsersCollection.insertOne({
      email,
      name,
      password: hashedPassword,
      favs: [],
    });
    return {
      email,
      name,
      id: newUser.insertedId.toString(),
    };
  } catch (error) {
    console.error(error);
    throw new Error(REGISTER_EXCEPTIONS.UNEXPECTED_ERROR);
  }
};

export default registerUser;
