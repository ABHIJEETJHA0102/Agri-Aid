const mongoose = require("mongoose");

const connectDB = () => {
    console.log("connect db");
    return mongoose.connect(process.env.DATABASE_URI.replace('<password>', process.env.DATABASE_PASSWORD), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
}

module.exports = connectDB;
