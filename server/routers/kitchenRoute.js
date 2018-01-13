module.exports = function (socket) {
    const express =	require('express'),
        handlers = require('./handlers/kitchenHandlers')(socket),
        kitchenRouter = express.Router();

    return kitchenRouter
        // Get orders by status
        .get('/orders/:status', handlers.getOrdersByStatus)
        // Change order status
        .put('/orders/:orderId', handlers.changeOrderById);
};