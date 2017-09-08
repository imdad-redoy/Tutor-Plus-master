const express = require('express');
const router = express.Router();
const User = require('mongoose').model('User'); // get
const flash = require('middlewares/flash');

router.get('/:uid/profile', function(req, res, next) {
	const uid = req.params.uid;
	User.findOne({
		_id: uid,
	})
	.populate('image')
	.populate('certificates')
	.populate('sampleResources')
	.exec(function(err, user) {
		if (err) return next(err);
		if (req.session.uid === uid) 
			return res.render('profileEditView', {user});
		else 
			return res.render('profileView', {user});
	});
});

module.exports = {
  addRouter(app) {
    app.use('/', [flash], router);
  },
};