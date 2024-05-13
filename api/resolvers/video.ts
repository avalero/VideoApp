import { RouterContext } from "jsr:@oak/oak@^16.0.0/router";

export const getVideo = async (ctx: RouterContext<"/video/:userid/:id">) => {
  const { id } = ctx.params;
  ctx.response.body = `Video ${id}`;
};
