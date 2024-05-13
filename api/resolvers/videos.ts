import { RouterContext } from "jsr:@oak/oak@^16.0.0/router";
import { VideosResponse } from "../types.ts";
import { videos } from "../data.ts";

export const getVideos = async (ctx: RouterContext<"/videos/:userid">) => {
  const { userid } = ctx.params;
  const response: VideosResponse = videos.map((video) => {
    return {
      ...video,
      fav: true,
    };
  });
  ctx.response.body = response;
};
