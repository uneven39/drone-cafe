module.exports = function (socket) {
    const Client = require('../../db/clientModel'),
        Order = require('../../db/orderModel');

    /**
     * Get client info by ID
     * @param req
     * @param res
     */
    function getInfo(req, res) {
        // console.log('client get info by ID: ', req.params);
        Client.findById(req.params.id, (error, found) => {
            if (error) {
                res.send(error);
                res.status(500);
            } else {
                res.send(found);
                res.status(200);
            }
        })
    }

    /**
     * Get orders of client by ID
     * @param req
     * @param res
     */
    function getOrders(req, res) {
        Order.find({clientId: req.params.id})
            .then(found => {
                res.send(found);
                res.status(200);
            })
            .catch(error => {
                res.send(error);
                res.status(500);
            })
    }

    /**
     * Create new client order
     * @param req
     * @param res
     */
    function createOrder(req, res) {
        // console.log('new order: ', req.params.id, req.body.dish);
        if (req.params.id && req.body.dish) {
            let newOrder = new Order({clientId: req.params.id, dish: req.body.dish, status: 'ordered'});
            newOrder.save((error, newOrderRecord) => {
                if (error) {
                    res.send(error);
                    res.status(500);
                } else {
                    res.send(newOrderRecord);
                    res.status(200);
                    socket.emit('ordersUpdated', newOrderRecord.clientId);
                }
            })
        } else {
            res.send('Invalid request');
            res.status(400);
        }
    }

    /**
     * Change client's balance by value in req.body
     * @param req
     * @param res
     */
    function changeBalance(req, res) {
        // console.log('update client\'s balance: ', req.params.id, req.body);
        if (req.params.id && req.body.balance) {
            Client.findById(req.params.id, (error, found) => {
                if (error) {
                    res.send(error);
                    res.status(500);
                } else {
                    found.balance = found.balance + (+req.body.balance);
                    found.save((error, updatedClient) => {
                        if (error) {
                            res.send(error);
                            res.status(500);
                        } else {
                            console.log(updatedClient);
                            res.send(updatedClient);
                            res.status(200);
                        }
                    });
                }
            })
        } else {
            res.send('Invalid request');
            res.status(400);
        }
    }

    return {
        getInfo,
        getOrders,
        createOrder,
        changeBalance
    }
};