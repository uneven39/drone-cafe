const express =	require('express'),
    fs = require('fs'),
    menuRouter = express.Router();

menuRouter
    .get('/', (req, res) => {
        fs.readFile('./server/menu.json', 'utf8', (error, data) => {
            if (error) {
                res.send(error);
                res.status(500)
            } else {
                res.send(data);
                res.status(200)
            }
        });
    });

module.exports = menuRouter;