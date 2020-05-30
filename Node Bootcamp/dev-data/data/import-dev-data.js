// use --import to import all data from tours-simple.json
// use --delete to clear all data from mongodb

const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config({path: `./config.env`})
const Tour = require('../../models/tourModel');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose.connect(DB, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
.then(() => console.log('db connected succesfully'))

// Read JSON File

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

// import data into DB
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data successfully loaded!');
    } catch (err) {
        console.log(err);
    } finally {
        process.exit();
    }
}

// delete all data from collection
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data successfully deleted!');
    } catch (err) {
        console.log(err);
    } finally {
        process.exit();
    }
}
if (process.argv[2] === '--import') importData();
if (process.argv[2] === '--delete') deleteData();
console.log(process.argv);