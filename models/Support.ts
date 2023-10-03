import { Schema , model } from "mongoose";

const supportSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  class: {type: String, required: true},
  teacher: {type: String , required: true},
  file: { type: String  ,},
});

export default model("Support", supportSchema)