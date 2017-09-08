const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		maxlength: 100,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		maxlength: 100,
	},
	password: {
		type: String,
		required: true,
	},
	image: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
	},
	classesAndSubjects: [{
		type: String,
	}],
	educationalBackground: [{
		type: String,
	}],
	experiences: [{
		type: String,
	}],
	times: [{
		type: String,
	}],
	contactNumbers: [{
		type: String,
	}],
	currentAddress: {
		type: String,
	},
	awardsAndAccomplishments:[{
		type: String,
	}],
	certificates:[{
		type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
	}],
	sampleResources:[{
		type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
	}],
	status: {
		type: String,
	},
	messages: [{
		type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
	}],
});

mongoose.model('User', userSchema); // set
