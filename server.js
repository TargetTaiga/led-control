const express = require('express');
const fs = require('fs');
const path = require('path');
const minify = require('html-minifier').minify;

const app = express();
const port = process.env.PORT || 3000;

app.get('/markup', (req, res) => {
    if (!req.query.app) {
        console.log('[ERROR_NO_APP]');
        return res.sendStatus(400);
    }
    fs.readFile(path.join(__dirname, 'markups', req.query.app + '.html'), (err, data) => {
        if (err) {
            console.error('[ERROR_CANT_READ]', err);
            if (err.code === 'ENOENT') {
                return res.sendStatus(400);
            }
            return res.sendStatus(500);
        }
        try {
            res.send(minify(data.toString(), {
                collapseInlineTagWhitespace: true,
                includeAutoGeneratedTags: false,
                collapseWhitespace: true,
                minifyJS: true,
                minifyCSS: true,
                removeComments: true,
            }))
        } catch (error) {
            console.log('[ERROR_CANT_MINIFY]', error);
        }
    })
});

app.get('/status', (req, res) => {
   res.json({ red: 255, green: 100, blue: 100 });
});

app.all('*', (req, res) => res.sendStatus(404));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))