const express =			require('express'),
			fs =					require('fs'),
			http =				require('http'),
			io =					require('socket.io'),
			drone =				require('netology-fake-drone-api'),
			bodyParser =	require('body-parser'),
			mongoose =		require('mongoose');

let Client =				require('./db/clientModel'),
		Order =					require('./db/orderModel');

mongoose.Promise =	global.Promise;

const config =			require('./serverConfig'),
			dbUrl = process.env.IS_LOCAL ? config.db.urlLocal : config.db.url;

let app =						express(),
		server =				http.Server(app),
		socketIO =			io(server),
		authRoute =			express.Router(),
		menuRoute =			express.Router(),
		kitchenRoute =	express.Router(),
		clientRoute =		express.Router();

app.use(express.static('./public'));
app.use('/lib', express.static('./node_modules/'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': true}));

app.use('/auth', authRoute);
app.use('/kitchen', kitchenRoute);
app.use('/client', clientRoute);
app.use('/menu', menuRoute);

server.listen(process.env.PORT || config.server.port);
console.log('Server is running on port: ', config.server.port);

mongoose.connect(dbUrl, {useMongoClient: true}, (error, db) => {
	if (error)
		console.error('Cannot connect to db: ', error);
	else {
		console.log('Connected to db');
	}
});

// Authentication
// -----------------------
authRoute.post('/', (req, res) => {
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

// Menu
// -----------------------
menuRoute
	.get('/', (req, res) => {
		fs.readFile(__dirname + '/menu.json', 'utf8', (error, data) => {
			if (error) {
				res.send(error);
				res.status(500)
			} else {
				res.send(data);
				res.status(200)
			}
		});
	});

// Client
// -----------------------
clientRoute
// Get client account info
	.get('/:id', (req, res) => {
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
	})
	// Get list of client orders
	.get('/:id/orders', (req, res) => {
		Order.find({clientId: req.params.id})
			.then(found => {
				res.send(found);
				res.status(200);
			})
			.catch(error => {
				res.send(error);
				res.status(500);
			})
	})
	// Create new client order
	.post('/:id/orders', (req, res) => {
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
					socketIO.emit('ordersUpdated', newOrderRecord.clientId);
				}
			})
		} else {
			res.send('Invalid request');
			res.status(400);
		}
	})
	// Change client balance
	.put('/:id', (req, res) => {
		// console.log('update client\'s balance: ', req.params.id, req.body);
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
	});

// Kitchen
// -----------------------
kitchenRoute
	// Get orders by status
	.get('/orders/:status', (req, res) => {
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
	})
	// Change order status
	.put('/orders/:orderId', (req, res) => {
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
	});

socketIO.on('connection', socket => {
	console.log('user connected');
	socket
		.on('orderStarted', clientId => {
			console.log('orderStarted: ', clientId);
			socket.emit('ordersUpdated', clientId);
		})
		.on('orderFinished', clientId => {
			console.log('orderFinished: ', clientId);
			socket.emit('ordersUpdated', clientId);
		})
		.on('disconnect', () => {
			console.log('user disconnected');
		});
});

function deliverOrder() {
	return drone.deliver();
}

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