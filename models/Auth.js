import mongoose from "mongoose";
import { Schema } from "mongoose";

const auth = new Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
});
export default mongoose.model("auth", auth);
