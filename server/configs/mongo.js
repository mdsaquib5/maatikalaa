import mongoose from "mongoose";

const mongoConnection = async () => {
    mongoose.connection.on('connected', () => {
        console.log('MongoDB Connected');
    });

    await mongoose.connect(`${process.env.MONGO_URI}/maatikalaa`);
}

export default mongoConnection;