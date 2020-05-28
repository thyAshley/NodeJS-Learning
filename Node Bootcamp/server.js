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
app.listen(port, () => {
    console.log(`server started at on port ${port}`);
})