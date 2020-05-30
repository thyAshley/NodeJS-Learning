require('dotenv').config({ path: './config.env' })

const app = require('./app');

const mongoose = require('mongoose');

const port = process.env.PORT || 3000;

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('unhandled reject!, shutting down application');
    server.close(() => {
        process.exit(1);
    });
});

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('Uncaught Exception!, shutting down application');
    server.close(() => {
        process.exit(1);
    });
});

// -- Connect to MongoDB atlas
mongoose.connect(DB, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
.then(() => console.log('db connected succesfully'));


// -- Start Server --
const server = app.listen(port, () => {
    console.log(`server started at on port ${port}`);
});

