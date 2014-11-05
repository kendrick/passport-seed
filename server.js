(function () {
    'use strict';

    var express  = require('express');
    var app      = express();
    var port     = process.env.PORT || 8080;
    var mongoose = require('mongoose');
    var passport = require('passport');
    var flash    = require('connect-flash');

    var morgan       = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser   = require('body-parser');
    var session      = require('express-session');
    var MongoStore   = require('connect-mongo')(session);

    var db     = require('./config/database');
    var secret = require('./config/secret');

    mongoose.connect(db.url);

    require('./config/passport')(passport);

    // Configure Express
    app.use(morgan('dev'));  // Log every request to the console
    app.use(cookieParser()); // Read cookies (needed for auth)
    app.use(bodyParser.json());   // Parse HTML forms
    app.use(bodyParser.urlencoded({ extended: true }));

    app.set('view engine', 'ejs'); // Configure ejs for templating

    // Configure Passport
    app.use(session({
        secret: secret.sessionSecret,
        saveUninitialized: true,
        resave: true,
        cookie: {
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days in ms
        },
        store: new MongoStore({
            mongoose_connection: mongoose.connections[0]
        })
    }));
    app.use(passport.initialize());

    // Enable persistent login sessions
    app.use(passport.session());
    app.use(flash());

    // Load routes & pass in app & Passport
    require('./app/routes')(app, passport);

    app.listen(port);
    console.log('The magic is happening on port ' + port);
})();