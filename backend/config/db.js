import mongoose from "mongoose";
const uri = process.env.MONGO_URI || "mongodb://localhost:27017/qr-payments";
const connectDB = async () => {
  await mongoose.connect(uri);
};
export default connectDB;