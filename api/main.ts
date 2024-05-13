import { Application } from "@oak/oak/application";
import { Router } from "@oak/oak/router";
import { getVideo } from "./resolvers/video.ts";
import { getVideos } from "./resolvers/videos.ts";
import { register } from "./resolvers/register.ts";
import { login } from "./resolvers/login.ts";
import { fav } from "./resolvers/fav.ts";
import { UsersModel, VideosModel, connectMongo } from "./mongo.ts";
import { Collection } from "mongodb";

const { UsersCollection, VideosCollection } = await connectMongo();

if (!UsersCollection || !VideosCollection) {
  throw new Error("Could not connect to MongoDB");
}

const router = new Router();
router.get("/video/:userid/:videoid", getVideo);
router.get("/videos/:userid", getVideos);
router.post("/register", register);
router.post("/login", login);
router.post("/fav/:userid/:id", fav);

const app = new Application<{
  UsersCollection: Collection<UsersModel>;
  VideosCollection: Collection<VideosModel>;
}>();

app.use(async (ctx, next) => {
  ctx.state.UsersCollection = UsersCollection;
  ctx.state.VideosCollection = VideosCollection;
  await next();
});

// avoid cors error
app.use(async (context, next) => {
  context.response.headers.set("Access-Control-Allow-Origin", "*");
  context.response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE"
  );
  context.response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  await next();
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8080 });

console.log("Server running on http://localhost:8080");
