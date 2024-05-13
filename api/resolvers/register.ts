import { RouterContext } from "jsr:@oak/oak@^16.0.0/router";

export const register = async (
  ctx: RouterContext<
    "/register",
    { usr: string; pwd: string; email: string; name: string }
  >
) => {
  ctx.response.body = `Video`;
};
