import { Schema , model } from "mongoose";

const messageSchema = new Schema({
   sender: {type: Schema.Types.ObjectId, ref: "User", required: true},
   receiver: {type: Schema.Types.ObjectId, ref: "User", required: true},
   content: {type: String, required: true},
   createAt: {type: Date, default: Date.now}

})

export default model('Message', messageSchema)