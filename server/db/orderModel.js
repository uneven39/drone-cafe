const mongoose =		require('mongoose'),
			orderSchema =	mongoose.Schema({
				clientId: String,
				dish: {
					title: String,
					image: String,
					id: Number,
					rating: Number,
					ingredients: Array,
					price: Number
				},
				status: String	// ordered -> cooking -> delivering -> failed / served
			}),
			Order =					mongoose.model('Order', orderSchema);

module.exports = Order;