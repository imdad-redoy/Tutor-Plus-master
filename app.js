const express = require('express'); //Load third-party module express
const app = express(); //This object is an instance of Express.
					   //This is the main object of our Express app
					   //and bulk of functionality is built on it.
const server = require('http').createServer(app);
const path = require('path');
const rootPath = __dirname;
const flash = require('express-flash');

app.set('port', 3000);
app.set('view engine', 'pug'); //Register a template engine for the app
app.set('views', path.join(rootPath, './views')); //It renders html from views folder

app.use('/public', express.static(path.join(rootPath, '/public')));

/* Configuration */
require('./configuration/bodyParser.js').addBodyParser(app);
require('./configuration/database.js');
require('./configuration/session.js').addSession(app);
app.use(flash()); //To flash message

/* Model */
require('./models/userModel.js');
require('./models/fileModel.js');
require('./models/messageModel.js');

/* Route */
require('./controllers/index.js').addRouter(app);
require('./controllers/downloadRoute.js').addRouter(app);
require('./controllers/message.js').addRouter(app);
require('./controllers/profile.js').addRouter(app);
require('./controllers/profileEdit.js').addRouter(app);
require('./controllers/joinResign.js').addRouter(app);

//Express error handling middleware
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
  next();
});

// If no route match, shows 404 error
app.get('*', function(req, res) {
	return res.status(404).send('Page not found\n');
});

server.listen(app.get('port'), function() {
	console.log(`Server running at port ${app.get('port')}`);
});