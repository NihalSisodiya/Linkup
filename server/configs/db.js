import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('Database Connected Successfully'))
        await mongoose.connect(`${process.env.MONGO_URI}/linka`)
    } catch (error) {
        console.log(error.message)
    }
}

export default connectDB;