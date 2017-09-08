const express = require('express');
const router = express.Router();

/* Download Routes */
router.get('/download/uploads/certificates/:path', function(req, res){
	const path = 'uploads/certificates/'+req.params.path;
	return res.download(path);
});

router.get('/download/uploads/sampleresources/:path', function(req, res){
	const path = 'uploads/sampleresources/'+req.params.path;
	return res.download(path);
});

module.exports = {
  addRouter(app) {
    app.use('/', router);
  },
};