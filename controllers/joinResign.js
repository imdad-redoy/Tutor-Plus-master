const express = require('express');
const router = express.Router();
const User = require('mongoose').model('User'); // get
const File = require('mongoose').model('File'); // get
const flash = require('middlewares/flash');
const loginUser = require('middlewares/loginUser');
const fs = require('fs');
const async = require('async');

router.post('/join', function(req, res, next) {
	const uid = req.session.uid;
	User.update({_id: uid}, 
		{$set: {status: "teacher"}}, function(err) {
			if (err) next(err);
			res.redirect('/'+uid+'/profile');
		});
});

router.post('/resign', function(req, res, next) {
	const uid = req.session.uid;
	User.findOne({
		_id: uid,
	})
	.populate('certificates')
	.populate('sampleResources')
	.exec(function(err, user) {
		if(err) next(err);
		user.classesAndSubjects = [];
		user.educationalBackground = [];
		user.experiences = [];
		user.times = [];
		user.contactNumbers = [];
		user.currentAddress = "";
		user.awardsAndAccomplishments = [];
		const copyFiles = user.certificates;
		copyFiles.concat(user.sampleResources);
		async.each(copyFiles, function(file, callback) {
			fs.unlink(file.path, function(err) {
				if (err) callback(err);
				File.findOne({
					_id: file._id,
				})
				.remove(function(err) {
					if(err) callback(err);
					return callback(null);
				});
			});
		}, function(err) {
			if(err) next(err);
			user.certificates = []; //Once all the files are deleted we can emtpy the array
			user.sampleResources = [];
			user.status = "student";
			user.save(function(err) {
				if (err) next(err);
				return res.redirect('/'+uid+'/profile');
			});
		});
	});
});

module.exports = {
  addRouter(app) {
    app.use('/:uid', [flash, loginUser], router);
  },
};