import mongoose from "mongoose";

const RecognitionLogSchema = new mongoose.Schema({
    visitor: {
        visitor_id: String,
        name: String,
        inmate: String,
        address: String,
    },
    similarity: Number,
    timestamp: Date,
    expiresAt: { type: Date },
    isSaveToLogs: { type: Boolean, default: false }
});

export default mongoose.model("RecognitionLog", RecognitionLogSchema, "visitorsLogs");