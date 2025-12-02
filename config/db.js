import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDb = async () => {
  if (process.env.MONGO_URI) {
    try {
      const connectionInstance = await mongoose.connect(process.env.MONGO_URI, {
        dbName: "tinyLink",
      });
      console.log("Database is connected");
    } catch (e) {
      console.log("connection error", e.message);
      process.exit(1);
    }
  } else {
    console.log("MongoURI is missing");
  }
};
