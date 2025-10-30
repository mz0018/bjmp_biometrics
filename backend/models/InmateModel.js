import mongoose from "mongoose";
import { getInmatesConnection } from "../config/connection.js";

const inmateSchema = new mongoose.Schema({
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
  mugshot_front: { type: Buffer },
  mugshot_left: { type: Buffer },
  mugshot_right: { type: Buffer },
}, { timestamps: true });

export const getInmateModel = () => {
  const conn = getInmatesConnection();
  if (!conn) throw new Error("Inmates DB connection not established yet");
  return conn.model("Inmates", inmateSchema);
};
