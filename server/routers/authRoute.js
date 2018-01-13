const express =	require('express'),
    Client = require('../db/clientModel');

let authRouter = express.Router();

authRouter.post('/', (req, res) => {
    console.log('auth post: ', req.body);

    let userName = req.body.name,
        userEmail = req.body.email;

    if (userName && userEmail) {
        let newClient = new Client({name: userName, email: userEmail, balance: 100});

        Client.findOne({email: userEmail})
            .then(found => {
                if (found) {
                    res.send(found);
                    res.status(200);
                } else {
                    newClient.save((error, newClientRecord) => {
                        if (error) {
                            res.send(error);
                            res.status(500);
                        } else {
                            res.send(newClientRecord);
                            res.status(200);
                        }
                    })
                }
            })
            .catch(error => {
                console.warn('get user from db error: ', error);

                res.send(error);
                res.status(500);
            })
    } else {
        res.send({error: 'invalid request'});
        res.status(400);
    }
});

module.exports = authRouter;