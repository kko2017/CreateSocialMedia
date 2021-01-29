const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello, backend');
});

app.listen(3085, () => {
    console.log(`backend server ${3085} port stand by...`);
});