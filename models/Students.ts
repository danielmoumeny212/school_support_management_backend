import { Schema , model } from "mongoose";


const studentSchema = new Schema({
  userId: { type: String , required: true },
  picture: { type: String, default: ""},
  classId: {type: Schema.Types.ObjectId, ref: "Class"},
  teachers: {
    type: Array, 
    default: []
  }
  
});

export default  model('Student', studentSchema);

