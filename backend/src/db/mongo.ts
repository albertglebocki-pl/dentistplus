import mongoose, {type ConnectOptions} from "mongoose";

const connectMongo = async () => {
    try {
        if(process.env.MONGO_URL !== undefined) {
            await mongoose.connect(process.env.MONGO_URL as string, {} as ConnectOptions);
            console.log("MongoDB connected");
        }
    }
    catch(error) {
        console.log("MongoDB connection failed ", error);
    }
}

export default connectMongo;