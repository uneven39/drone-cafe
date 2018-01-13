module.exports = function (socket) {
    const express =	require('express'),
        handlers = require('./handlers/clientHandlers')(socket),
        clientRouter = express.Router();

    return clientRouter
    // Get client account info
        .get('/:id', handlers.getInfo)
        // Get list of client orders
        .get('/:id/orders', handlers.getOrders)
        // Create new client order
        .post('/:id/orders', handlers.createOrder)
        // Change client balance
        .put('/:id', handlers.changeBalance);
};