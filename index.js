const config = require('./config');
const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || config.port;
const serverUrl = `${config.serverBaseUrl}:${config.port}/`;
const outputDir = path.join(__dirname, 'public');
app.use(express.static(outputDir));

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    res.send('Pleas use "/upload" endpoint with the POST method to upload a file.');
});

app.post(`/${config.serverUploadRoute}`, (req, res) => {
    const name = req.body.name;
    const file = req.body.parsedFile;
    const p = path.join(outputDir, name);

    fs.writeFile(p, file, err => {
        const response = {
            success: !err,
            message: !err ? `File "${name}" created successfully` : `File "${name}" could not be created. Error: ${err}`,
            fileUrl: !err ? `${serverUrl}${name}` : null
        };

        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(response));
    });
});

app.listen(port, () => {
    console.log(`Express server is running on port ${port}`);
});
