import mongoose from "mongoose";
const connectDB = async () => {
    try {
        // await mongoose.connect(process.env.MONGO_URI); //Online Atlas MongoDB Database URL
        await mongoose.connect(process.env.MONGO_LOCAL_URI); //Offline MongoDB Compass Database URL 


        console.log(`MongoDB Connected`);

    } catch (error) {
        console.log(`Error Occured`, error);
    }
}
export default connectDB;
