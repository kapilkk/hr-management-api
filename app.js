const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();

const authRoutes = require('./api/routes/auth');
const employeeRoutes = require('./api/routes/employee');
const leaveRoutes = require('./api/routes/leave');
const analyticsRoutes = require('./api/routes/analytics');



//db connection
mongoose
    .connect(`mongodb+srv://super-admin:${process.env.PASSWORD}@cluster0.hzbov.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => {
        console.log("DB CONNECTED");
    })
    .catch((err) => {
        console.log('ERROR: ', err);
    });


//middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());


//routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/analytics", analyticsRoutes);


//port
const port = process.env.PORT || 5000;

//starting a server
app.listen(port, () => {
    console.log("Listening at: ", port);
});