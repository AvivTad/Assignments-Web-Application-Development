import mongoose from "mongoose";

export interface iComment {
  postId: string,
  sender: string,
  content: string,
}

const commentSchema = new mongoose.Schema<iComment>({
  postId: {
    type: String,
    ref: "Posts",
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  }
});

const commentModel = mongoose.model<iComment>("Comments", commentSchema);

export default commentModel;