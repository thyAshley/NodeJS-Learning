const http = require('http');
const routes = require('./routes');
// Node is a framework build using V8 javascript engine, unlike standard javascript, Node is able to interface files and folder which allow them to interface with the backend system.

// fs is node file system library, this library allows javascript to interface with user files. Node is used in the backend and the frontline is still able to touch the user files. Node is used for backend validation and authentication which is not accessible by the users.

// To create a server, we can use http or https, which is built in with node. https is encrypted with ssl unlike http and is more secure.

// http.createServer((req,res) => {}) creates a listener which continuously listen to any activity on the server, to stop the server, we can use process.exit() 

// We start a server by using the listen function and providing a port to the function, this starts the server on the given port, we are also able to get information from the user when the user access the url that node is listening on.

// req.header, req.methods give the method the user is accessing the site by.
// res is the response from the server, we can include information such as res.write() and providing information back to the user. At the end of multiple write lines, we can use a res.end() to notify the end of write, after res.end() no new write() is allowed.

// the information send from the user thru post method are send in buffers,

const server = http.createServer(routes)

server.listen(3000,()=>{
    console.log('server started at port 3000');
    
});