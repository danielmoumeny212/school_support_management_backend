import { Schema, model } from "mongoose";

const evaluationSchema = new Schema({
  userId: {
    type: String,
    required: true, 
  },
  description: {
    type: String, 
    
  }, 
  examType: {
     type: String, 
     enum: ["google form"]
  },
  formLink: {
    type: String, 
    max: 280,
    required: true 
  },
  date: {
     type: Date, 
     required: true 
  },
  classId: {
    type: String, 
    required: true
  }
})

export default model('Evaluation', evaluationSchema); 