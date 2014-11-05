(function () {
    var LocalStrategy = require('passport-local').Strategy;

    var User = require('../../app/models/user');

    var config = {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    };

    var verifySignup = function (req, email, password, done) {
        // Call User.findOne asynchronously when data is sent back
        process.nextTick(function () {

            // Find a user whose email is the same as the forms email. Check
            // to see if the user trying to login already exists.
            User.findOne({ 'local.email': email }, function (err, existingUser) {
                if (err) {
                    return done(err);
                }

                // Check to see if a user with that email already exists
                if (existingUser) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                }

                if (req.user) {
                    var user            = req.user;
                    user.local.email    = email;
                    user.local.password = user.generateHash(password);

                    user.save(function (err) {
                        if (err) {
                            throw err;
                        }

                        return done(null, user);
                    });
                }
                // We're not logged in, so create a brand new user
                else {
                    var newUser = new User();

                    // Set local credentials
                    newUser.local.email    = email;
                    newUser.local.password = newUser.generateHash(password);

                    newUser.save(function (err) {
                        if (err) {
                            throw err;
                        }

                        return done(null, newUser);
                    });
                }
            });
        });
    };

    var verifyLogin = function (req, email, password, done) {
        User.findOne({ 'local.email': email }, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            }

            if (!user.validPassword(password)) {
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            }

            // Valid user with correct password, return successful user
            return done(null, user);
        });
    };

    module.exports = {
        signup: new LocalStrategy(config, verifySignup),
        login:  new LocalStrategy(config, verifyLogin)
    };
})();