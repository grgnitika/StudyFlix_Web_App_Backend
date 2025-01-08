const express = require("express");
const connectDB = require("./config/db");
const app = express();

connectDB();

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.get('/', (req, res) => {

    res.send('Hello World!');

});