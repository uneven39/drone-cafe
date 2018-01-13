module.exports = function (socketIO) {
    const drone = require('netology-fake-drone-api'),
        Order = require('../../db/orderModel');

    /**
     * Get orders by status
     * @param req
     * @param res
     */
    function getOrdersByStatus(req, res) {
        let status = req.params.status;

        if (status) {
            Order.find({status: status}, (error, orders) => {
                if (error) {
                    res.send(error);
                    res.status(500);
                } else {
                    res.send(orders);
                    res.status(200);
                }
            })
        } else {
            res.send('invalid request');
            res.status(400);
        }
    }

    /**
     * Change order status by order ID
     * @param req
     * @param res
     */
    function changeOrderById(req, res) {
        let newStatus = req.body.status,
            orderId = req.params.orderId;

        Order.findById(orderId, (error, found) => {
            if (error) {
                res.send(error);
                res.status(500);
            } else {
                found.status = newStatus;
                found.save((error, updatedOrder) => {
                    if (error) {
                        res.send(error);
                        res.status(500);
                    } else {
                        // Launch delivery and handle result if order is finished on kitchen
                        if (newStatus === 'delivering') {
                            deliverOrder()
                                .then(() => {
                                    handleDeliveredOrder(found, 'served', res);
                                })
                                .catch((error) => {
                                    handleDeliveredOrder(found, 'failed', res);
                                })
                        }
                        res.send(updatedOrder);
                        res.status(200);
                        socketIO.emit('ordersUpdated', updatedOrder.clientId);
                    }
                });
            }
        })
    }

    /**
     * Get delivery result as Promise
     */
    function deliverOrder() {
        return drone.deliver();
    }

    /**
     * Handle order after delivery is finished
     * @param foundOrder
     * @param newStatus
     * @param response
     */
    function handleDeliveredOrder(foundOrder, newStatus, response) {
        foundOrder.status = newStatus;
        foundOrder.save((error, updatedOrder) => {
            if (error) {
                response.send(error);
                response.status(500);
            } else {
                socketIO.emit('ordersUpdated', updatedOrder.clientId);
                removeOrder(updatedOrder._id);
                response.status(200);
            }
        })
    }

    /**
     * Remove order by ID after delivery with timeout = 120 sec
     * @param orderId
     * @returns {number | Object}
     */
    function removeOrder(orderId) {
        console.log('find and remove finished order by id: ', orderId);
        return setTimeout(() => {
            Order.findByIdAndRemove(orderId, (error, found) => {
                if (error) {
                    console.error('Cannot remove finished order ' + orderId + ': ', error);
                } else {
                    socketIO.emit('ordersUpdated', found.clientId);
                }
            })
        }, 120000)
    }

    return {
        getOrdersByStatus,
        changeOrderById
    }
};