import { Schema, model } from "mongoose";
import { IProject } from "../../types";

const ProjectSchema = new Schema<IProject>({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  challenge: {
    type: Schema.Types.ObjectId,
    ref: "Challenge",
  },
  student: {
    type: String,
    required: true,
  },
  tutor: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  trello: String,
  repo: {
    back: String,
    front: String,
  },
  prod: {
    back: String,
    front: String,
  },
  sonarKey: {
    back: String,
    front: String,
  },
});

const Project = model("Project", ProjectSchema, "projects");

export default Project;
