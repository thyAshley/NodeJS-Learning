const express = require('express');
const app = express();
const todoController = require('./controllers/todoController');
// template engine set up
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));

// static files
app.use(express.static('public'));

todoController(app);

// list to port
app.listen(3000, () => {
    console.log('server started at port 3000');
    
})
