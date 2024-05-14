import { RouterContext } from "jsr:@oak/oak@^16.0.0/router";
import { ObjectId } from "mongodb";
import { ContextState, VideoResponse } from "../types.ts";

export const getVideo = async (
  ctx: RouterContext<
    "/video/:userid/:videoid",
    { userid: string; videoid: string },
    ContextState
  >,
  next: () => Promise<unknown>,
) => {
  const { videoid } = ctx.params;
  const { userid } = ctx.params;
  const user = await ctx.state.UsersCollection.findOne({
    _id: new ObjectId(userid),
  });
  if (!user) {
    ctx.response.status = 404;
    ctx.response.body = { message: "User not found" };
    return;
  }

  const video = await ctx.state.VideosCollection.findOne({
    _id: new ObjectId(videoid),
  });
  if (!video) {
    ctx.response.status = 404;
    ctx.response.body = { message: "Video not found" };
    return;
  }

  const { _id, ...rest } = video;
  const response: VideoResponse = {
    ...rest,
    id: video._id.toString(),
    fav: user.favs.includes(video._id.toString()),
  };

  ctx.response.body = response;
  return next();
};
