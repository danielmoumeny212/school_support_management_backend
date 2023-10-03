import { Schema , model } from "mongoose";

const teacherSchema = new Schema({
  userId: { type: String , required: true },
  subjects: {
    type: Array, 
    default: []
  },
  experience: { type: Number, },
  // students: [{ type: Schema.Types.ObjectId, ref: "Student" }], 
  classes : {
    type: Array, 
    default: []
  }
});

export default model("Teacher", teacherSchema)