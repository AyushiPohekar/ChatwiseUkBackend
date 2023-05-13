import mongoose, { model, Schema } from "mongoose";

const requestSchema = new Schema({
  status: {
    type: String,
    enum: ["pending", "accept", "reject"],
    default: "pending",
  },
  sender: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default model("Request", requestSchema);