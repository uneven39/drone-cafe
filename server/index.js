const express =	require('express'),
    http = require('http'),
    io = require('socket.io'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const config = require('./serverConfig'),
    dbUrl = process.env.IS_LOCAL ? config.db.urlLocal : config.db.url;

let app = express(),
    server = http.Server(app),
    socketIO = io(server);

// Routers:
const clientRoute = require('./routers/clientRoute')(socketIO),
    kitchenRoute = require('./routers/kitchenRoute')(socketIO),
    authRoute = require('./routers/authRoute'),
    menuRoute = require('./routers/menuRouter');

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
    if (error) {
        console.error('Cannot connect to db: ', error);
    } else {
        console.log('Connected to db');
    }
});

socketIO.on('connection', socket => {
    console.log('user connected');
    socket
        .on('orderStarted', clientId => {
            console.log('orderStarted by client (id): ', clientId);
            socket.emit('ordersUpdated', clientId);
        })
        .on('orderFinished', clientId => {
            console.log('orderFinished of client (id): ', clientId);
            socket.emit('ordersUpdated', clientId);
        })
        .on('disconnect', () => {
            console.log('user disconnected');
        });
});