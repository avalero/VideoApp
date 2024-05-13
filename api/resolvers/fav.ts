import { RouterContext } from "jsr:@oak/oak@^16.0.0/router";

export const fav = async (ctx: RouterContext<"/fav/:userid/:id">) => {
  ctx.response.body = `Video`;
};
