import {Schema , model } from "mongoose"; 
import Student from "./Students";
import Teachers from "./Teachers";

const UserSchema = new Schema({
  username: {
    type: String,
    required: true, 
    unique: true, 

  }, 
  email: {
    type: String, required: true, unique: true, 
  }, 
  password: {type: String, required: true, unique: true},
  name: { type: String},
  first_name:  {type: String, },
  role: { type: String, enum: ['student', 'teacher', 'admin'], required: true },

}, 
{timestamps: true}
); 

UserSchema.post('save', function(user, next){
  if(user.role === 'student'){
    const student = new Student({
      userId: user._id,
    });
    student.save();
  } else if (user.role === 'teacher'){
    const teacher = new Teachers({
      userId: user._id,
    })
    teacher.save();
  }
  next();
});

export default model("User", UserSchema);