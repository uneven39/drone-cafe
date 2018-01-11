const mongoose =		require('mongoose'),
			Schema =			mongoose.Schema;

module.exports = new Schema({
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
});