(function () {
    var BasecampStrategy = require('passport-37signals').Strategy;

    var User       = require('../../app/models/user');
    var configAuth = require('./../auth');

    var config = {
        clientID:     configAuth.basecamp.clientID,
        clientSecret: configAuth.basecamp.clientSecret,
        callbackURL:  configAuth.basecamp.callbackURL,
        passReqToCallback: true
    };

    var verify = function(req, token, refreshToken, profile, done) {
        process.nextTick(function () {
            if (!req.user) {
                User.findOne({ 'basecamp.id': profile.id }, function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    if (user) {
                        // If user exists, but no token, re-add token & profile information
                        if (!user.basecamp.token) {
                            user.basecamp.token = token;
                            user.basecamp.name  = profile.displayName;
                            user.basecamp.email = profile.emails[0].value;

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

                        newUser.basecamp.id    = profile.id;
                        newUser.basecamp.token = token;
                        newUser.basecamp.name  = profile.displayName;
                        newUser.basecamp.email = profile.emails[0].value;

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

                user.basecamp.id    = profile.id;
                user.basecamp.token = token;
                user.basecamp.name  = profile.displayName;
                user.basecamp.email = profile.emails[0].value;

                user.save(function (err) {
                    if (err) {
                        throw err;
                    }

                    return done(null, user);
                });
            }
        });
    };

    module.exports = new BasecampStrategy(config, verify);
})();