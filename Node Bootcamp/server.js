require('dotenv').config({ path: './config.env' })

const app = require('./app');

const port = process.env.PORT || 3000;

// -- Start Server --
app.listen(port, () => {
    console.log(`server started at on port ${port}`);
})