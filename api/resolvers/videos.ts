import { RouterContext } from "jsr:@oak/oak@^16.0.0/router";
import { ContextState, VideosResponse } from "../types.ts";
import { ObjectId } from "mongodb";

export const getVideos = async (
  ctx: RouterContext<"/videos/:userid", { userid: string }, ContextState>,
  next: () => Promise<void>
) => {
  const { userid } = ctx.params;
  const UsersCollection = ctx.state.UsersCollection;
  if (!UsersCollection) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Internal server error" };
    return next();
  }

  // check userid is ObjectId
  if (!ObjectId.isValid(userid)) {
    ctx.response.status = 400;
    ctx.response.body = { message: "Invalid userid" };
    return next();
  }

  const user = await UsersCollection.findOne({
    _id: new ObjectId(userid),
  });

  if (!user) {
    ctx.response.status = 404;
    ctx.response.body = { message: "User not found" };
    return next();
  }

  const videos = await ctx.state.VideosCollection.find().toArray();
  const response: VideosResponse = videos.map((video) => {
    const { _id, ...rest } = video;
    return {
      ...rest,
      id: video._id.toString(),
      fav: user.favs.includes(video.id),
    };
  });

  ctx.response.status = 200;
  ctx.response.body = JSON.stringify(response);
  return next();
};
