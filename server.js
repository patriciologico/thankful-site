var express  = require('express');
var compression = require('compression');
var app      = express();
var port     = process.env.PORT || 80;
var mongoose = require('mongoose');
var passport = require('passport');
var flash 	 = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');
var i18n = require("i18n");

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms


app.set('view engine', 'ejs');

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//static content
app.use(compression());
app.use(express.static(__dirname+'/public'));

//i18n
i18n.configure({
    locales:['en', 'es'],
    defaultLocale: 'en',
    cookie: 'thankfullocale',
    directory: __dirname + '/locales'
});

app.use(i18n.init);

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
