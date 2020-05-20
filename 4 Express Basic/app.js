const express = require('express');
const path = require('path');
const rootDir = require('./util/path')
const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

//express.urlencoded or bodyParser.urlencoded
app.use(express.urlencoded({extended: true}))

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Catch error website, use app.use to catch all type of request
app.use('/', (req,res) => {
    res.status(404).sendFile(path.join(rootDir, 'views', '404.html'));
})

app.listen(3000);

