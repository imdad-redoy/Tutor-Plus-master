const express = require('express');
const router = express.Router();
const User = require('mongoose').model('User'); // get
const File = require('mongoose').model('File'); // get
const flash = require('middlewares/flash');
const loginUser = require('middlewares/loginUser');
const multer = require('multer');
const fs = require('fs');

/* Add routes */
router.post('/add', function(req, res, next) {
	const uid = req.session.uid;
	const txt = req.body.txt;
	const type = req.body.type;
	User.update({_id: uid},
		{$push: {[type]: txt}}, function(err) {
			if (err) next(err);
			return res.send(null);
		});
});

router.post('/currentAddress', function(req, res, next) {
	const uid = req.session.uid;
	const txt = req.body.txt;
	User.update({_id: uid},
		{$set: {currentAddress: txt}}, function(err) {
			if (err) next(err);
			return res.send(null);
		});
});

router.post('/certificates', 
	multer({dest: 'uploads/certificates/'}).single('file'), function(req, res, next) {
	const uid = req.session.uid;
	const tempPath = req.file.path;
	const targetPath = tempPath+'_'+req.file.originalname;
    fs.rename(tempPath, targetPath, function(err) {
    	if(err) return res.send("Error uploading file.");
    	const file = new File({
    		path: targetPath,
    		name: req.file.originalname,
    	});
    	file.save(function(err) {
    		if(err) next(err);
    		User.update({_id: uid},
    			{$push: {certificates: file._id}}, function(err) {
    				if(err) next(err);
    				const data = {};
    				data.path = targetPath;
    				data.name = req.file.originalname;
    				res.send(data);
    			});
    	});
		
    });
});

router.post('/sampleresources', 
	multer({dest: 'uploads/sampleresources/'}).single('file'), function(req, res, next) {
	const uid = req.session.uid;
	const tempPath = req.file.path;
	const targetPath = tempPath+'_'+req.file.originalname;
    fs.rename(tempPath, targetPath, function(err) {
    	if(err) return res.send("Error uploading file.");
    	const file = new File({
    		path: targetPath,
    		name: req.file.originalname,
    	});
    	file.save(function(err) {
    		if(err) next(err);
    		User.update({_id: uid},
    			{$push: {sampleResources: file._id}}, function(err) {
    				if(err) next(err);
    				const data = {};
    				data.path = targetPath;
    				data.name = req.file.originalname;
    				res.send(data);
    			});
    	});
		
    });
});

const imageFilter = function (req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

router.post('/image', 
	multer({dest: 'public/image', fileFilter: imageFilter}).single('file'),
	function(req, res, next) {
	const uid = req.session.uid;
	const targetPath = req.file.path;

	User.findOne({
		_id: uid,
	})
	.populate('image')
	.exec(function(err, user) {
		File.findOne({
			_id: user.image._id,
		})
		.remove(function(err) {
			if (err) next(err);
			const file = new File({
	    		path: targetPath,
	    		name: req.file.originalname,
	    		userEmail: req.session.email,
	    	});
	    	file.save(function(err) {
	    		if(err) next(err);
	    		User.update({_id: uid},
	    			{$set: {image: file._id}}, function(err) {
	    				if(err) next(err);
	    				const data = {};
	    				data.path = targetPath;
	    				data.name = req.file.originalname;
	    				res.send(data);
	    			});
	    	});
		});
	});
});

/* Delete Routes */
router.post('/delete', function(req, res, next) {
	const uid = req.session.uid;
	const type = req.body.type;
	const index = req.body.index;
	let file;
	User.findOne({
		_id: uid,
	})
	.populate('certificates')
	.populate('sampleResources')
	.exec(function(err, user) {
		if (err) next(err);
		if (type === "certificates" || type === "sampleResources") {
			file = user[type][index];
		}
		user[type].splice(index, 1);
		user.save(function(err) {
			if (err) next(err);
			if(type === "certificates" || type === "sampleResources") {
				fs.unlink(file.path, function(err) {
					if (err) next(err);
					File.findOne({
						_id: file._id,
					})
					.remove(function(err) {
						if(err) next(err);
						return res.send(null);
					});
				});
			}
			else {
				return res.send(null);
			}
		});
	});
});

module.exports = {
  addRouter(app) {
    app.use('/:uid/profile', [flash, loginUser], router);
  },
};