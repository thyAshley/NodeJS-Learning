const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

const users = [];

app.get('/', (req, res) => {
    res.render('index', {title: '123'});
});
app.get('/users', (req,res) => {
    res.render('users', {title: 'Users', users: users});
});
app.post('/add-user', (req, res) => {
    users.push(req.body);
    res.redirect('/');
});

app.listen((3000), ()=>{
    console.log('server started at port 3000');
})