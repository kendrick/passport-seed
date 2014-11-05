(function () {
    var TwitterStrategy = require('passport-twitter').Strategy;

    var User       = require('../../app/models/user');
    var configAuth = require('./../auth');

    var config = {
        consumerKey:    configAuth.twitterAuth.consumerKey,
        consumerSecret: configAuth.twitterAuth.consumerSecret,
        callbackURL:    configAuth.twitterAuth.callbackURL,
        passReqToCallback: true
    };

    var verify = function (req, token, tokenSecret, profile, done) {
        // Async; User.findOne won't fire until we have all our data back from Twitter
        process.nextTick(function () {
            if (!req.user) {
                User.findOne({ 'twitter.id': profile.id }, function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    // If user exists, log them in
                    if (user) {
                        // If user exists, but no token, re-add token & profile information
                        if (!user.twitter.token) {
                            user.twitter.token       = token;
                            user.twitter.username    = profile.username;
                            user.twitter.displayName = profile.displayName;

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
                        newUser.twitter.id          = profile.id;
                        newUser.twitter.token       = token;
                        newUser.twitter.username    = profile.username;
                        newUser.twitter.displayName = profile.displayName;

                        // Save user to db
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

                user.twitter.id          = profile.id;
                user.twitter.token       = token;
                user.twitter.username    = profile.username;
                user.twitter.displayName = profile.displayName;

                user.save(function (err) {
                    if (err) {
                        throw err;
                    }

                    return done(null, user);
                });
            }
        });
    };

    module.exports = new TwitterStrategy(config, verify);
})();