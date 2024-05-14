import { User, Video } from "./types.ts";
import { Document, MongoClient } from "mongodb";

async function connectToDatabase() {
  try {
    const url = Deno.env.get("MONGO_URL");
    if (!url) {
      throw new Error("MONGO_URL environment variable not set");
    }

    const client = new MongoClient(url);

    await client.connect();
    console.log("Connected to the database");

    return client;
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

function getCollection<T extends Document>(
  client: MongoClient,
  dbname: string,
  collection: string,
) {
  try {
    const db = client.db(dbname);
    return db.collection<T>(collection);
  } catch (error) {
    console.error("Error getting collection:", error);
  }
}

export const connectMongo = async () => {
  const client = await connectToDatabase();
  if (!client) {
    throw new Error("Error connecting to the database");
  }

  const DB_NAME = Deno.env.get("DB_NAME");
  if (!DB_NAME) {
    throw new Error("DBNAME environment variable not set");
  }

  const UsersCollection = await getCollection<UsersModel>(
    client,
    DB_NAME,
    "users",
  );
  const VideosCollection = await getCollection<VideosModel>(
    client,
    DB_NAME,
    "videos",
  );

  return { UsersCollection, VideosCollection };
};

export type UsersModel = Document & Omit<User, "id">;
export type VideosModel = Document & Omit<Video, "id">;
