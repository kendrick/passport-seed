(function () {
    var FacebookStrategy = require('passport-facebook').Strategy;

    var User = require('../../app/models/user');
    var configAuth = require('./../auth');

    var config = {
        clientID:          configAuth.facebookAuth.clientID,
        clientSecret:      configAuth.facebookAuth.clientSecret,
        callbackURL:       configAuth.facebookAuth.callbackURL,
        passReqToCallback: true
    };

    var verify = function (req, token, refreshToken, profile, done) {
        process.nextTick(function () {
            if (!req.user) {
                // Find user in db based on Facebook id
                User.findOne({ 'facebook.id': profile.id }, function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    // If user found, log them in
                    if (user) {
                        // If user exists, but no token, re-add token & profile information
                        if (!user.facebook.token) {
                            user.facebook.token = token;
                            user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                            user.facebook.email = profile.emails[0].value;

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
                        // If no user found with that Facebook id, create them
                        var newUser = new User();

                        // Set Facebook information in our user model
                        newUser.facebook.id    = profile.id;
                        newUser.facebook.token = token;
                        newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                        newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                        // Save user to db
                        newUser.save(function (err) {
                            if (err) {
                                throw err;
                            }

                            // If successful, return the new user
                            return done(null, newUser);
                        });
                    }
                });
            }
            else {
                // User already exists & is logged in, so pull the user out of
                // the session & link accounts
                var user = req.user;

                // Update the current user's Facebook credentials
                user.facebook.id    = profile.id;
                user.facebook.token = token;
                user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                user.facebook.email = profile.emails[0].value;

                user.save(function (err) {
                    if (err) {
                        throw err;
                    }

                    return done(null, user);
                });
            }
        });
    };

    module.exports = new FacebookStrategy(config, verify);
})();