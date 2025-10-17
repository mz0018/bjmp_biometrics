import mongoose from "mongoose";

const inmateSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    middleInitial: { type: String },
    lastname: { type: String, required: true },
    gender: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    nationality: { type: String, required: true },
    address: { type: String, required: true },
    civilStatus: { type: String, required: true },
    height: { type: String, required: true },
    weight: { type: String, required: true },
    caseNumber: { type: String, required: true, unique: true },
    offense: { type: String, required: true },
    sentence: { type: String, required: true },
    courtName: { type: String, required: true },
    arrestDate: { type: Date, required: true },
    commitmentDate: { type: Date, required: true },
    status: { type: String, required: true },
    remarks: { type: String },

    mugshot_front: { type: String },
    mugshot_left: { type: String },
    mugshot_right: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Inmates", inmateSchema);
