const express = require("express");
const dotenv = require("dotenv").config({ path: './.env' });
const app = express();
const connectDB = require("./db/openConnect");
const path = require("path"); // Import path module


const PORT = process.env.PORT || 5000;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());
// This line is important to parse the body of incoming requests
app.use(express.json());
const user_routes = require("./routes/userRoutes");

// middleware
app.use("/", user_routes);

//connecting html
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, '/public')));
// app.use(express.static('public'));
app.use(express.static('public'));

const start = async () => {
    try {
        await connectDB(process.env.DATABASE_URI.replace('<password>', process.env.DATABASE_PASSWORD));
        app.listen(PORT, () => {
            console.log(`${PORT} Connected`);
        });
    } catch (error) {
        console.log(error);
    }
}
start()
