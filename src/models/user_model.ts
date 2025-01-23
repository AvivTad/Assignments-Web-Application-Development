import mongoose, { Schema, Document } from "mongoose";

export interface iUser extends Omit<Document, '_id'> {
  _id?: mongoose.Types.ObjectId; // נשאר אופציונלי
  email: string;
  password: string;
  refreshTokens?: string[];
}

const userSchema = new Schema<iUser>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  refreshTokens: { type: [String], default: [] },
});

const userModel = mongoose.model<iUser>("User", userSchema);

export default userModel;
