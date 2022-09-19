import { Schema, model } from "mongoose";
import userDataMinimums from "../../constants";
import { IUser } from "../../types";

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: userDataMinimums.name,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: userDataMinimums.username,
  },
  password: {
    type: String,
    required: true,
    minlength: userDataMinimums.password,
  },
});

const User = model("User", UserSchema, "users");

export default User;
