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

            var findByEmail = {
                $or: [
                    { 'local.email'   : email },
                    { 'google.email'  : email },
                    { 'facebook.email': email },
                    { 'basecamp.email': email }
                ]
            };

            // Find a user whose email is the same as the forms email. Check
            // to see if the user trying to login already exists.
            User.findOne(findByEmail, function (err, existingUser) {
                if (err) {
                    return done(err);
                }

                // Check to see if a user with that email already exists
                if (existingUser) {
                    if (existingUser.local.email === undefined) {
                        existingUser.local.email    = email;
                        existingUser.local.password = existingUser.generateHash(password);

                        existingUser.save(function (err) {
                            if (err) {
                               throw err;
                            }

                            return done(null, existingUser);
                        });
                    }
                    else {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    }
                }
                else if (req.user) {
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
                else {
                    // We're not logged in, so create a brand new user
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