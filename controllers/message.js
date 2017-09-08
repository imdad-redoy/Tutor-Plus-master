const express = require('express');
const router = express.Router();
const User = require('mongoose').model('User'); // get
const Message = require('mongoose').model('Message'); // get
const flash = require('middlewares/flash');
const loginUser = require('middlewares/loginUser');

router.post('/submit', function(req, res, next) {
    if (req.session.uid != req.body.fromid) {
    	req.flash('error', 'You need to login.');
    	return res.redirect('/login');
    }
	const text = req.body.text;
	const toid = req.body.toid;
	const fromid = req.body.fromid;
	
	Message.findOne({
		$or: [
			{ $and: [{user1: toid}, {user2: fromid}] },
			{ $and: [{user1: fromid}, {user2: toid}] },
		]
	}, function(err, message) {
		if (err) next(err);
		if (message ===  null) {
			const newMessage = new Message({
				user1: fromid,
				user2: toid,
				body: {
					text: text,
					from: 1, //don't forget to change in two place
				},
			});
			newMessage.save(function(err) {
				if (err) next(err);
				User.update({_id: toid},
					{$push: {messages: newMessage._id}}, function(err) {
						if (err) next(err);
						User.update({_id: fromid},
							{$push: {messages: newMessage._id}}, function(err) {
								if (err) next(err);
								res.send(null);
							});
					});
			});
		}
		else {
			let fromUser;
			if (message.user1.toString() === fromid.toString())
				fromUser = 1;
			else
				fromUser = 2;
			Message.update({_id: message._id},
				{$push: {body: {text: text, from: fromUser}}}, function(err) {
					if (err) next(err);
					//Doing pull and push to change the position of the message.
					User.update({_id: fromid},
						{$pull: {messages: message._id}}, function(err) {
							if (err) next(err);
							User.update({_id: fromid},
								{$push: {messages: message._id}}, function(err) {
									if (err) next(err);
									User.update({_id: toid},
									{$pull: {messages: message._id}}, function(err) {
										if (err) next(err);
										User.update({_id: toid},
											{$push: {messages: message._id}}, function(err) {
												if (err) next(err);
												return res.send(null);
											});
									});
								});
						});
				});
		}
		
	});
});

router.get('/:uid', [loginUser], function(req, res, next) {
	const uid = req.params.uid;
	User.findOne({
		_id: uid,
	})
	.populate({path: 'messages', 
		populate:{path: 'user1 user2',
		populate: {path: 'image'}}})
	.exec(function(err, user) {
		if (err) next(err);
		return res.render('message.pug', {user});
	});
});

router.get('/:uid/:mid', [loginUser], function(req, res, next) {
	const uid = req.params.uid;
	const mid = req.params.mid;
	let indx = -1; //user has no access to this message
	User.findOne({
		_id: uid,
	})
	.populate({path: 'messages', 
		populate:{path: 'user1 user2',
		populate: {path: 'image'}}})
	.exec(function(err, user) {
		if (err) next(err);
		for(let i=0; i<user.messages.length; i++) {
			if (user.messages[i]._id.toString() === mid.toString()) {
				indx = i;
				break;
			}
		}
		if (indx === -1) {
			req.flash('error', 'You have to login');
			return res.redirect('/login');
		}
		else {
			return res.render('history.pug', {user, indx});
		}
	});
});

module.exports = {
  addRouter(app) {
    app.use('/message', [flash], router);
  },
};