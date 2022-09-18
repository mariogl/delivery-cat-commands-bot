import { Schema, model } from "mongoose";

const ChallengeSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  week: {
    type: Number,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
});

const Challenge = model("Challenge", ChallengeSchema, "challenges");

export default Challenge;
