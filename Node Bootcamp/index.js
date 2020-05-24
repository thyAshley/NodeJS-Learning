const fs = require('fs');
const superagent = require('superagent');

fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
    console.log(`Breed: ${data}`);
    
    superagent.get(`https://dog.ceo/api/breed/${data}/images/random/3/2/1/`)
    .end((err, res) => {
        if (err) return console.log(err.message);
        fs.writeFile('dog-img.txt', res.body.message, (err) => {
            if (err) return console.log(err);
            console.log('image saved to file');
        })
    })
})