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
            if (err) reject('API issue');
            resolve('Image saved to file');
        })
    })
}

const getDogPic = async () => {
    try {
        const data = await readFile(`${__dirname}/dog.txt`);
        const res = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random/`);
        await writeFile(`${__dirname}/dog-img.txt`, res.body.message)
        console.log('image saved to file');
    } catch (err) {
        console.log(err.message || err);
    }
}
getDogPic();
// readFile(`${__dirname}/dog.txt`)
//     .then((data) => {
//         return superagent.get(`https://dog.ceo/api/breed/${data}/images/random/`)
//     })
//     .then(res => {
//         return writeFile(`${__dirname}/dog-img.txt`, res.body.message)
//     })
//     .then(() => {
//         console.log('image saved');
//     })
//     .catch(err => {
//         console.log(err.message || err);
//     })
