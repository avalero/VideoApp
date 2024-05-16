import { RouterContext } from "jsr:@oak/oak@^16.0.0/router";
import { ContextState } from "../types.ts";
import { ObjectId } from "mongodb";

export const fav = async (
  ctx: RouterContext<
    "/fav/:userid/:videoid",
    { userid: string; videoid: string },
    ContextState
  >,
  next: () => Promise<unknown>
) => {
  const { userid, videoid } = ctx.params;
  const UsersCollection = ctx.state.UsersCollection;
  const VideosCollection = ctx.state.VideosCollection;
  if (!UsersCollection || !VideosCollection) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Internal server error" };
    return;
  }
  const video = await VideosCollection.findOne({ _id: new ObjectId(videoid) });
  if (!video) {
    ctx.response.status = 404;
    ctx.response.body = { message: "Video not found" };
    return;
  }

  const user = await UsersCollection.findOne({ _id: new ObjectId(userid) });
  if (!user) {
    ctx.response.status = 404;
    ctx.response.body = { message: "User not found" };
    return;
  }

  const favs = user.favs;
  const index = favs.indexOf(videoid);
  if (index === -1) {
    favs.push(videoid);
  } else {
    favs.splice(index, 1);
  }

  await UsersCollection.updateOne(
    { _id: new ObjectId(userid) },
    { $set: { favs } }
  );

  ctx.response.status = 200;
  ctx.response.body = { message: "Success" };
  return next();
};
