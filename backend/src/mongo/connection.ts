import mongoose from "mongoose";

if (!process.env.MONGO_URL) {
  throw new Error("MONGO_URL is not set");
}

const connectMongo = async () => {
  await mongoose.connect(process.env.MONGO_URL as string);
};

export default connectMongo;
