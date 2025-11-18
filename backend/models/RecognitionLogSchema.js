import mongoose from "mongoose";

const RecognitionLogSchema = new mongoose.Schema({
  visitor_id: {
    type: String,
    required: true,
  },

  visitor_info: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    gender: { type: String, required: true },
    inmates: [
      {
        inmate_name: String,
        relationship: String,
      }
    ],
  },

  selected_inmate: {
    inmate_name: String,
    relationship: String,
  },

  similarity: Number,
  timestamp: Date,
  expiresAt: { type: Date },
  isSaveToLogs: { type: Boolean, default: false }
});

export default mongoose.model("RecognitionLog", RecognitionLogSchema, "visitorsLogs");
