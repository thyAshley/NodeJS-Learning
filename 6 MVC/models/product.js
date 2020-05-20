const fs = require('fs');
const path = require('path');
const rootDir = path.dirname(process.mainModule.filename);
const p = path.join(rootDir, '/data', 'products.json');

const getProductsFromFile = (cb) => { 
    fs.readFile(p, (err, content) => {
        if (err) {
            return cb([]);
        } else {
            return cb(JSON.parse(content));
        }
    })
}
module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        getProductsFromFile((products) => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }
}