import mongoose, { type ConnectOptions } from "mongoose";

const connection = async () => {
  try {
    if (process.env.MONGO_URL !== undefined) {
      await mongoose.connect(
        process.env.MONGO_URL as string,
        {} as ConnectOptions,
      );

      console.log("Connection to MongoDB established successfully.");
    }
  } catch (error) {
    console.error("Connection to MongoDB could not have been established!");
  }
};

export default connection;
