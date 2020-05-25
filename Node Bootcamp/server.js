const app = require('./app');

const port = 3000;
// -- Start Server --
app.listen(port, () => {
    console.log(`server started at on port ${port}`);
})
