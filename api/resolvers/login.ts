import { RouterContext } from "jsr:@oak/oak@^16.0.0/router";

export const login = async (
  ctx: RouterContext<"/login", { usr: string; pwd: string }>
) => {
  ctx.response.body = `Video`;
};
