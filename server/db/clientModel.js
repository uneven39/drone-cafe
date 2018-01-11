const mongoose =			require('mongoose'),
			clientSchema =	mongoose.Schema({
				name: String,
				email: String,
				balance: Number
			}),
			Client =				mongoose.model('Client', clientSchema);

module.exports = Client;