require('dotenv').config({ path: './config.env' })

const app = require('./app');

const mongoose = require('mongoose');


const port = process.env.PORT || 3000;

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);
// -- Connect to MongoDB atlas
mongoose.connect(DB, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
.then(() => console.log('db connected succesfully'))


// -- Start Server --
const server = app.listen(port, () => {
    console.log(`server started at on port ${port}`);
})

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('unhandled reject!, shutting down application');
    server.close(() => {
        process.exit(1);
    });
})