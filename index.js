const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const outputDir = 'public/files';
const outputBaseUrl = `http://localhost:5005/files/`;

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const port = process.env.PORT || 5005;

app.get('/', (req, res) => {
    res.send('Pleas use "/upload" endpoint with the POST method to upload a file.');
});

app.post('/upload', (req, res) => {
    const name = req.body.name;
    const file = req.body.parsedFile;
    const p = path.join(
        path.dirname(process.mainModule.filename),
        outputDir,
        name
    );

    fs.writeFile(p, file, err => {
        const response = {
            success: !err,
            message: !err ? `5005: File "${name}" created successfully` : `5005: File "${name}" could not be created`,
            filePath: !err ? `${outputBaseUrl}${name}` : null
        };

        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(response));
    });
});

app.listen(port, () => {
    console.log(`Express server is running on http://localhost:${port}`);
});
