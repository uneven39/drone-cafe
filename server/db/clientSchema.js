const mongoose =		require('mongoose'),
			Schema =			mongoose.Schema;

module.exports = new Schema({
	name: String,
	email: String,
	balance: Number
});