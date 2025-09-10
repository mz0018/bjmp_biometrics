import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        username: { type: String, required: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model("Admin", adminSchema)