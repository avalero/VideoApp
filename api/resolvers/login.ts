import { RouterContext } from "jsr:@oak/oak@^16.0.0/router";
import { ContextState } from "../types.ts";
import bcrypt from "bcrypt";

export const login = async (
  ctx: RouterContext<
    "/login",
    Record<string | number | symbol, never>,
    ContextState
  >,
  next: () => Promise<unknown>,
) => {
  const { email, password } = await ctx.request.body.json();
  const UsersCollection = ctx.state.UsersCollection;

  if (!UsersCollection) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Internal server error" };
    return next();
  }

  const user = await UsersCollection.findOne({ email });
  if (!user) {
    ctx.response.status = 404;
    ctx.response.body = { message: "User not found" };
    return next();
  }

  // verify hahsed password
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    ctx.response.status = 400;
    ctx.response.body = { message: "Invalid password" };
    return next();
  }

  ctx.response.status = 200;
  ctx.response.body = { message: "Success" };

  return next();
};
