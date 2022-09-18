import { Schema, model } from "mongoose";

const ProjectSchema = new Schema({
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
  trello: String,
  repo: {
    back: String,
    front: String,
  },
  prod: {
    back: String,
    front: String,
  },
});

const Project = model("Project", ProjectSchema, "projects");

export default Project;
