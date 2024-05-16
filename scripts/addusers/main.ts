import { connectMongo } from "../../api/mongo.ts";
import registerUser from "../../api/controllers/registeruser.ts";
import { readAll } from "@std/io";

const { UsersCollection, VideosCollection } = await connectMongo();

if (!UsersCollection || !VideosCollection) {
  throw new Error("Could not connect to MongoDB");
}

type Alumno = {
  email: string;
  name: string;
  password: string;
};

// read csv file
const file = await Deno.open("./alumnos.csv");

// read csv file tab separated -- name, password, email

const decoder = new TextDecoder();
const data = await readAll(file);
const decodedData = decoder.decode(data);
const lines = decodedData.split("\n");

// parse data
const alumnos: Alumno[] = lines.map((line) => {
  const [name, password, email] = line.split("\t");
  return { name, password, email };
});

// register users
for (const alumno of alumnos) {
  try {
    if (alumno?.email === "") continue;
    console.log(`Registering user ${alumno.email}`);
    await registerUser(
      UsersCollection,
      alumno.email,
      alumno.password,
      alumno.name
    );
  } catch (error) {
    console.error(`Error registering user ${alumno.email}: ${error.message}`);
  }
}

console.log("Done!");
Deno.exit(0);
