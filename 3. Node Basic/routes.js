const fs = require('fs')

const route = (req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<h1>Hello World</h1>');
        res.write('<form action="/message" method="POST"><input type="text" name="msg"><button type="submit">SUBMIT</button></form>');
        return res.end();
    }
    if (url === '/message' && req.method === 'POST') {
        const body = [];
        // all req data are streamed in chunks called buffer, nodeJS do not know how big the chunks are, from here we push each chunk into the single array
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        // after all data are streamed, the item stored in the body array are all buffer object, next we concat all the element and conver the element to string. result: "msg=userinput"
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message=parsedBody.split('=')[1];
            fs.writeFileSync('message.txt', message);
            res.statusCode = 200;
            res.setHeader('Location', '/');
            return res.end();
        });
    }
    res.setHeader('Content-Type', 'text/html');
    res.write('<h1>Hello World</h1>');
    res.write('<p>Lorem ipsum</p>');
    res.end()
}

module.exports = route;