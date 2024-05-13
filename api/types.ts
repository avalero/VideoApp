import { Collection } from "mongodb";
import { UsersModel, VideosModel } from "./mongo.ts";

export type Video = {
  id: string;
  title: string;
  duration: number;
  description: string;
  url: string;
  thumbnail: string;
  date: Date;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  favs: string[];
};

export type UserResponse = Omit<User, "password">;
export type VideoResponse = Video & { fav: boolean };
export type VideosResponse = VideoResponse[];
export type LoginResponse = { token: string; user: UserResponse };
export type RegisterResponse = { token: string; user: UserResponse };
export type ContextState = {
  UsersCollection: Collection<UsersModel>;
  VideosCollection: Collection<VideosModel>;
};
