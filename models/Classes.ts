import { Schema , model } from "mongoose";

const classSchema = new Schema({
    name: {type: String, required: true},
    evaluations: {
      type: Array, 
      default: []
    },
    supports : {
      type : Array, 
      default: []
    },
    teachers: {
      type: Array, 
      default: []
    },
    students: {
      type: Array, 
      default: []
    }
})

export default model("Classe", classSchema);