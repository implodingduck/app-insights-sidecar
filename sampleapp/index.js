const express = require('express');

//Create an app
const app = express();
app.get('/', (req, res) => {
    res.send('Hello world\n');
    console.log('console hello world')
    process.stdout.write('stdout write hello world\n')
});

//Listen port
const PORT = 8080;
app.listen(PORT);
console.log(`Running on port ${PORT}`);