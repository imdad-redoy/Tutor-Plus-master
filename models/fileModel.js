const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
	path: {
			type: String,
	},
	name: {
		type: String,
	},
	date: {
			type: Date,
			default: Date.now,
	},
	userEmail: {
		type: String,
	},
});

mongoose.model('File', fileSchema);