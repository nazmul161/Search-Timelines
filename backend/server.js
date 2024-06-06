const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;

// Calling MongoDB connection function
connectDB();

const app = express();

// Fixing NetworkError
var cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use('/users', require('./routes/usersRoutes'));
app.use('/saveddocs', require('./routes/saveddocsRoutes'));
app.use('/queries', require('./routes/queriesRoutes'));


app.listen(port, () => console.log(`server started on port ${port}`))