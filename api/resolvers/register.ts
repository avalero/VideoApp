import { RouterContext } from "jsr:@oak/oak@^16.0.0/router";
import { ContextState } from "../types.ts";
import bcrypt from "bcrypt";

export const register = async (
  ctx: RouterContext<
    "/register",
    Record<string | number | symbol, never>,
    ContextState
  >,
  next: () => Promise<unknown>,
) => {
  // pwd, email, name in body
  const { email, name, password } = await ctx.request.body.json();
  const UsersCollection = ctx.state.UsersCollection;

  if (!UsersCollection) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Internal server error" };
    return next();
  }

  const user = await UsersCollection.findOne({ email });
  if (user) {
    ctx.response.status = 400;
    ctx.response.body = { message: "User already exists" };
    return next();
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 8);

  await UsersCollection.insertOne({
    email,
    name,
    password: hashedPassword,
    favs: [],
  });

  ctx.response.status = 200;
  ctx.response.body = { message: "Success" };

  return next();
};
