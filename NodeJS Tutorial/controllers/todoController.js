const mongoose = require('mongoose');
require('dotenv').config()

// Connect to DB
mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@testdb-ukelm.mongodb.net/test?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});

const todoSchema = new mongoose.Schema({
    item: {
        type: String
    }
});

const Todo = mongoose.model('Todo', schema=todoSchema);

module.exports = function(app) {

    app.get('/todo', (req,res) => {
        Todo.find({}, (err , result) => {
            if (err) throw err;
            res.render('todo', {todos: result})
            })
        });
    
    app.post('/todo', (req,res) => {
        const newItem = Todo(req.body).save((err, data) => {
            if (err) throw err;
            res.redirect('/todo');
        });
    })

    app.get('/todo/delete/:item', (req,res) => {
        Todo.find({item: req.params.item}).deleteOne((err, data) => {
            if (err) throw err;
            res.redirect('/todo');  
        });
    })
}