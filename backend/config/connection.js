import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoURI = process.env.MONGO_URI;
const mongoURI_Inmates = process.env.MONGO_URI_INMATES;

let inmatesConnection;

export const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB (bjmp_biometrics)");

        inmatesConnection = mongoose.createConnection(mongoURI_Inmates);
        inmatesConnection.once('open', () => {
            console.log("Connected to MongoDB (inmates)");
        });
    } catch (err) {
        console.error("Connection Error: ", err.message);
        process.exit(1);
    }
};

export const getInmatesConnection = () => inmatesConnection;
