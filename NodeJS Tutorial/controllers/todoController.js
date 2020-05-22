let data = [{item: 'Eat the food'}, {item: 'drink the milk'}, {item: 'walk dog'}];

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
        Todo.find((err , result) => {
            if (err) console.log(err);
            else {
                res.render('todo', {todos: result})
            }
            
        });
    })
    
    app.post('/todo', (req,res) => {
        const newItem = Todo(req.body).save((err) => {
            if (err) console.log(err);
            console.log('item')
            res.redirect('/todo');
        });
    })

    app.get('/todo/delete/:item', (req,res) => {
        res.redirect('/todo');  
    })
}