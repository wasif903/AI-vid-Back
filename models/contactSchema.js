import mongoose from "mongoose";
import { Schema } from "mongoose";

const contactSchema = new Schema(
  {
    query: {
      type: String,
    },
    userEmail: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);
export default mongoose.model("contact", contactSchema);
