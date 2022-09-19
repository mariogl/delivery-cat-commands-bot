import { Schema, model } from "mongoose";
import { IChallenge } from "../../types";

const ChallengeSchema = new Schema<IChallenge>({
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
