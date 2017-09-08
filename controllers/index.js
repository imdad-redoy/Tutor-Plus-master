const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('mongoose').model('User'); // get
const File = require('mongoose').model('File'); // get
const flash = require('middlewares/flash');

router.get('/', function(req, res, next) {
	User.find({
		status: 'teacher',
	})
	.populate('image')
	.exec(function(err, users) {
		if (err) return next(err);
		if (req.session.login === true)
			return res.render('index', {users, login: true, 
				user: {_id: req.session.uid, name: req.session.name}});
		else return res.render('index', {users, login: false});
	});
});

router.get('/login', function(req, res) {
	return res.render('login');
});

router.post('/login', function(req, res, next) {
	const email = req.body.email;
	const password = req.body.password;

	User.findOne({
	    email,
	})
    .exec(function(err, user) {
    	if (err) return next(err);
        if (!user) {
        	req.flash('error', 'Email address or password incorrect.');
        	return res.redirect('/login');
        }
        bcrypt.compare(password, user.password, function(err, result) {
      		if (err) return next(err);
      		if(!result) {
      			req.flash('error', 'Email address or password incorrect.');
        		return res.redirect('/login');
      		}
      		else {
      			req.flash('success', 'Successfully logged in');
        		req.session.login = true;
        		req.session.email = email;
        		req.session.name = user.name;
        		req.session.uid = user._id;
        		return res.redirect('/');
      		}
        });
	});
});

router.get('/signup', function(req, res) {
	return res.render('signup');
});

router.post('/signup', function(req, res, next) {
	const name = req.body.name;
	const email = req.body.email;
	const pass = req.body.password;
	const repass = req.body.repassword;

	if(pass.toString() !== repass.toString()) {
		req.flash('error', 'Passwords do not match.');
	    return res.redirect('/signup');
	}

	// Autogen salt and hash
 	bcrypt.hash(pass, require('./../secret.js').round, function(err, hash) {
	    if (err) {
	    	return next(err);
	    }
	    else {
	    	const file = new File({
	    		path: 'public/image/avatar.jpeg',
	    		name: 'avatar.jpeg',
	    		userEmail: email,
	    	});
	    	file.save(function(err) {
	    		if(err) next(err);
	    		const user = new User({
		    		name,
		    		email,
		    		password: hash,
		    		status: "student",
		    		image: file._id,
		    	});
		    	user.save(function(err) {
				    if (err) {
				      if (err.code === 11000) {
				        req.flash('error', 'Email address already exists');
				      } else {
				        return next(err);
				      }
				      return res.redirect('/signup');
				    }
				    req.flash('success', 'Successfully registered');
				    return res.redirect('/');
				});
	    	});
	    }
	});
});

router.get('/logout', function(req, res, next) {
	req.session.destroy(function(err) {
    	if (err) next(err);
    	return res.redirect('/');
	});
})

module.exports = {
  addRouter(app) {
    app.use('/', [flash], router);
  },
};