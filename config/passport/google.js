(function () {
    'use strict';

    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    var User       = require('../../app/models/user');
    var configAuth = require('./../auth');

    var config = {
        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
        passReqToCallback: true
    };

    var verify = function (req, token, refreshToken, profile, done) {
        // Async; User.findOne won't fire until we have all our data back from Google
        process.nextTick(function () {
            if (!req.user) {
                User.findOne({ 'google.id': profile.id }, function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    if (user) {
                        // If user exists, but no token, re-add token & profile information
                        if (!user.google.token) {
                            user.google.token = token;
                            user.google.name  = profile.displayName;
                            user.google.email = profile.emails[0].value;

                            user.save(function (err) {
                                if (err) {
                                    throw err;
                                }

                                return done(null, user);
                            });
                        }

                        return done(null, user);
                    }
                    else {
                        var newUser = new User();

                        // Set relevant user data
                        newUser.google.id    = profile.id;
                        newUser.google.token = token;
                        newUser.google.name  = profile.displayName;
                        newUser.google.email = profile.emails[0].value; // Pull the first email

                        newUser.save(function (err) {
                            if (err) {
                                throw err;
                            }

                            return done(null, newUser);
                        });
                    }
                });
            }
            else {
                var user = req.user;

                user.google.id    = profile.id;
                user.google.token = token;
                user.google.name  = profile.displayName;
                user.google.email = profile.emails[0].value;

                user.save(function (err) {
                    if (err) {
                        throw err;
                    }

                    return done(null, user);
                });
            }
        });
    };

    module.exports = new GoogleStrategy(config, verify);
})();