const express = require('express');
const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', (req, res) => {
    res.send(
        '<form action="/admin/add-product" method="post"><input type="text" name="title"><button type="submit">Add Products</button></form>'
        );
});

// /admin/add-product => POST
router.post('/add-product', (req, res) => {
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;