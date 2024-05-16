import { RouterContext } from "jsr:@oak/oak@^16.0.0/router";
import { ContextState, RegisterResponse } from "../types.ts";
import registerUser, {
  REGISTER_EXCEPTIONS,
} from "../controllers/registeruser.ts";

export const register = async (
  ctx: RouterContext<
    "/register",
    Record<string | number | symbol, never>,
    ContextState
  >,
  next: () => Promise<unknown>
) => {
  // password, email, name in body
  const { email, name, password } = await ctx.request.body.json();
  const UsersCollection = ctx.state.UsersCollection;

  if (!UsersCollection) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Internal server error" };
    return next();
  }

  try {
    const user = await registerUser(UsersCollection, email, password, name);
    console.log("User registered", user);
    ctx.response.status = 200;
    ctx.response.body = { email: user.email, name: user.name, id: user.id };
    return next();
  } catch (e) {
    switch (e.message) {
      case REGISTER_EXCEPTIONS.USER_ALREADY_EXISTS:
        ctx.response.status = 400;
        break;
      default:
        ctx.response.status = 500;
        break;
    }
    ctx.response.body = { message: e.message };
    return next();
  }
};
