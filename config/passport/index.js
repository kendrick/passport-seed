(function () {
    'use strict';

    var User = require('../../app/models/user');

    module.exports = function (passport) {
        // Required for persistent login sessions;  used to serialize the user for the session
        passport.serializeUser(function (user, done) {
            done(null, user.id);
        });

        passport.deserializeUser(function (id, done) {
            User.findById(id, function (err, user) {
                done(err, user);
            });
        });

        passport.use(require('./google'));
        passport.use(require('./basecamp'));
        passport.use(require('./twitter'));
        passport.use(require('./facebook'));

        // Using named strategies since we have one for login and one for signup.
        // By default, if there was no name, it would just be called 'local'
        var localStrategy = require('./local');
        passport.use('local-signup', localStrategy.signup);
        passport.use('local-login', localStrategy.login);
    };
})();