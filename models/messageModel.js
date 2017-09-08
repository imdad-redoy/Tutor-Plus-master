const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
	user1: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
	},
	user2: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
	},
	body: [{
			text: {
				type: String,
			},
			from: {
				type: Number,
			},
			date: {
				type: Date,
				default: Date.now,
			},
	}],
});

mongoose.model('Message', messageSchema);