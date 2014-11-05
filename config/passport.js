(function () {
    'use strict';

    var LocalStrategy          = require('passport-local').Strategy;
    var FacebookStrategy       = require('passport-facebook').Strategy;
    var TwitterStrategy        = require('passport-twitter').Strategy;
    var GoogleStrategy         = require('passport-google-oauth').OAuth2Strategy;
    var Thirty7SignalsStrategy = require('passport-37signals').Strategy;

    var User = require('../app/models/user');
    var configAuth = require('./auth');

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

        passport.use(new GoogleStrategy({
                clientID        : configAuth.googleAuth.clientID,
                clientSecret    : configAuth.googleAuth.clientSecret,
                callbackURL     : configAuth.googleAuth.callbackURL,
                passReqToCallback: true
            },
            function (req, token, refreshToken, profile, done) {
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
            })
        );

        passport.use(new Thirty7SignalsStrategy({
                clientID:     configAuth.thirty7signals.clientID,
                clientSecret: configAuth.thirty7signals.clientSecret,
                callbackURL:  configAuth.thirty7signals.callbackURL,
                passReqToCallback: true
            },
            function(req, token, refreshToken, profile, done) {
                process.nextTick(function () {
                    if (!req.user) {
                        User.findOne({ 'thirty7signals.id': profile.id }, function (err, user) {
                            if (err) {
                                return done(err);
                            }

                            if (user) {
                                // If user exists, but no token, re-add token & profile information
                                if (!user.thirty7signals.token) {
                                    user.thirty7signals.token = token;
                                    user.thirty7signals.name  = profile.displayName;
                                    user.thirty7signals.email = profile.emails[0].value;

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

                                newUser.thirty7signals.id    = profile.id;
                                newUser.thirty7signals.token = token;
                                newUser.thirty7signals.name  = profile.displayName;
                                newUser.thirty7signals.email = profile.emails[0].value;

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

                        user.thirty7signals.id    = profile.id;
                        user.thirty7signals.token = token;
                        user.thirty7signals.name  = profile.displayName;
                        user.thirty7signals.email = profile.emails[0].value;

                        user.save(function (err) {
                            if (err) {
                                throw err;
                            }

                            return done(null, user);
                        });
                    }
                });
            }
        ));

        passport.use(new TwitterStrategy({
                consumerKey:    configAuth.twitterAuth.consumerKey,
                consumerSecret: configAuth.twitterAuth.consumerSecret,
                callbackURL:    configAuth.twitterAuth.callbackURL,
                passReqToCallback: true
            },
            function (req, token, tokenSecret, profile, done) {
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
            })
        );

        passport.use(new FacebookStrategy({
                // Pull in app id & secret from auth.js
                clientID:          configAuth.facebookAuth.clientID,
                clientSecret:      configAuth.facebookAuth.clientSecret,
                callbackURL:       configAuth.facebookAuth.callbackURL,
                passReqToCallback: true
            },
            // Facebook will send back the token and profile
            function (req, token, refreshToken, profile, done) {
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
            })
        );

        // Using named strategies since we have one for login and one for signup.
        // By default, if there was no name, it would just be called 'local'
        passport.use('local-signup', new LocalStrategy({
                    // By default, local strategy uses username and password, we will override with email
                    usernameField: 'email',
                    passwordField: 'password',
                    passReqToCallback: true
                },
                function (req, email, password, done) {
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
                })
        );

        passport.use('local-login', new LocalStrategy({
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true // Pass the entire request to the callback
            },
            function (req, email, password, done) {
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
            }
        ));
    };
})();