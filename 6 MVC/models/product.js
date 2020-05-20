const fs = require('fs');
const path = require('path');

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        const rootDir = path.dirname(process.mainModule.filename);
        const p = path.join(rootDir, '/data', 'products.json');
        fs.readFile(p, (err, content) => {
            let products = [];
            if (!err) {
                products = JSON.parse(content);
            } 
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        })
    }

    static fetchAll(cb) {
        const rootDir = path.dirname(process.mainModule.filename);
        const p = path.join(rootDir, '/data', 'products.json');
        fs.readFile(p, (err, content) => {
            if (err) {
                cb([]);
            } else {
                cb(JSON.parse(content));
            }
        })
    }
}