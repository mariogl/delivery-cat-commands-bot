import { Types } from "mongoose";

export type Side = "front" | "back";

export interface IProject {
  name: string;
  challenge: Types.ObjectId;
  student: string;
  tutor: Types.ObjectId;
  trello: string;
  repo: {
    back: string;
    front: string;
  };
  prod: {
    back: string;
    front: string;
  };
  sonarKey: {
    back: string;
    front: string;
  };
}

export interface IChallenge {
  name: string;
  week: number;
  number: string;
}

export interface IUser {
  name: string;
  username: string;
  password: string;
}
