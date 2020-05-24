const fs = require('fs');
const superagent = require('superagent');

const readFile = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) {
                reject('file cannot be found');
            } else {
                resolve(data);
            }
        });
    });
}

const writeFile = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, (err) => {
            if (err) reject(err);
            resolve('Image saved to file');
        })
    })
}
readFile(`${__dirname}/dog.txt`).then((data) => {
    superagent.get(`https://dog.ceo/api/breed/${data}/images/random`).then(res => {
        writeFile(`${__dirname}/dog-img.txt`, data).then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        });
    })
    .catch(err => {
        console.log(err.message);
    })
})
.catch((err) => {
    console.log(err);
})
