import { MongoClient } from "mongodb";

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

async function disconnectFromDatabase(client: MongoClient) {
  try {
    await client.close();
    console.log("Disconnected from the database");
  } catch (error) {
    console.error("Error disconnecting from the database:", error);
  }
}

async function getCollection(
  client: MongoClient,
  db: string,
  collection: string
) {
  try {
    const db = client.db("deno_fresh");
    return db.collection(name);
  } catch (error) {
    console.error("Error getting collection:", error);
  }
}

export const connectMongo = async () => {
  const client = await connectToDatabase();
  if (!client) {
    throw new Error("Error connecting to the database");
  }

  const DB_NAME = Deno.env.get("DBNAME");
  if (!DB_NAME) {
    throw new Error("DBNAME environment variable not set");
  }

  const UsersCollection = await getCollection(client, DB_NAME, "users");

  return { UsersCollection };
};
