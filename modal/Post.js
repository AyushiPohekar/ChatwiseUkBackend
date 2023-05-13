import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
 
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [{
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },], // References to the users who liked the post
  comments: [
    {
     
      userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },// Reference to the user who made the comment
      content: String,
      createdAt: Date,
      updatedAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
});

export default mongoose.model("Post", postSchema);
