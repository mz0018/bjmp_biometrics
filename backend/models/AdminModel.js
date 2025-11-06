import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    username: { type: String, required: function() { return !this.googleId; } },
    password: { type: String, required: function() { return !this.googleId; } },
    email: { type: String, unique: true, sparse: true },
    googleId: { type: String, unique: true, sparse: true },
    photoURL: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
