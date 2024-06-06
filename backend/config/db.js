const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // If you want to use another MongoDB, go to the .env file and change MONGO_URI
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB connected');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB