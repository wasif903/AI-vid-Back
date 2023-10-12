import mongoose from "mongoose";
import { Schema } from "mongoose";

const counter = new Schema({
    counter: {
        type: Number,
        require: true
    }
});
export default mongoose.model("counter", counter);
