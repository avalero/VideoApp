import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import VideoList from "../components/VideoList.tsx";
import { Video } from "../types.ts";

type State = {
  id: string;
  name: string;
  email: string;
};

type Data = {
  videos: Video[];
};

export const handler: Handlers<Data, State> = {
  GET: async (req: Request, ctx: FreshContext<State, Data>) => {
    const userid = ctx.state.id;
    // fetch API_URL/videos/:userid
    const API_URL = Deno.env.get("API_URL");
    if (!API_URL) {
      throw new Error("API_URL is not set in the environment");
    }
    const response = await fetch(`${API_URL}/videos/${userid}`);
    if (response.status !== 200) {
      return ctx.render({ videos: [] });
    }
    const videos: Video[] = await response.json();
    return ctx.render({ videos });
  },
};

const Page = (props: PageProps<Data>) => (
  <div class="video-page-container">
    <h1 className="video-list-title">Curso Deno Fresh</h1>
    <VideoList videos={props.data.videos} />
  </div>
);

export default Page;
