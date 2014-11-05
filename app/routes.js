(function () {
    'use strict';

    // Route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        res.redirect('/');
    }

    module.exports = function(app, passport) {

        app.get('/', function(req, res) {
            res.render('index.ejs');
        });

        app.get('/login', function(req, res) {
            // Render & pass in any flash data if it exists
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // Redirect to the secure profile section
            failureRedirect : '/login',   // Redirect back to the signup page if there is an error
            failureFlash : true           // Allow flash messages
        }));

        app.get('/signup', function(req, res) {
            // Render & pass in any flash data if it exists
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // Redirect to the secure profile section
            failureRedirect : '/signup',  // Redirect back to the signup page if there is an error
            failureFlash    : true        // Allow flash messages
        }));

        // we will want this protected so you have to be logged in to visit
        // we will use route middleware to verify this (the isLoggedIn function)
        app.get('/profile', isLoggedIn, function(req, res) {
            res.render('profile.ejs', {
                user : req.user // get the user out of session and pass to template
            });
        });

        app.get('/logout', function(req, res) {
            req.logout();
            res.redirect('/');
        });

        app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
        app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            })
        );

        app.get('/auth/37signals', passport.authenticate('37signals'));
        app.get('/auth/37signals/callback',
            passport.authenticate('37signals', {
                successRedirect : '/profile',
                failureRedirect : '/'
            })
        );

        app.get('/auth/twitter', passport.authenticate('twitter'));
        app.get('/auth/twitter/callback',
            passport.authenticate('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            })
        );

        app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            })
        );

        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile',
            failureRedirect : '/connect/local',
            failureFlash : true
        }));
        app.get('/unlink/local', function (req, res) {
            var user            = req.user;
            user.local.email    = undefined;
            user.local.password = undefined;

            user.save(function (err) {
                res.redirect('/profile');
            });
        });

        app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            })
        );
        app.get('/unlink/facebook', function (req, res) {
            var user            = req.user;
            user.facebook.token = undefined;

            user.save(function (err) {
                res.redirect('/profile');
            });
        });

        app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));
        app.get('/connect/twitter/callback',
            passport.authorize('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            })
        );
        app.get('/unlink/twitter', function (req, res) {
            var user           = req.user;
            user.twitter.token = undefined;

            user.save(function (err) {
                res.redirect('/profile');
            });
        });

        app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));
        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            })
        );
        app.get('/unlink/google', function (req, res) {
            var user          = req.user;
            user.google.token = undefined;

            user.save(function (err) {
                res.redirect('/profile');
            });
        });

        app.get('/connect/37signals', passport.authorize('37signals', { scope : 'email' }));
        app.get('/connect/37signals/callback',
            passport.authorize('37signals', {
                successRedirect : '/profile',
                failureRedirect : '/'
            })
        );
        app.get('/unlink/37signals', function (req, res) {
            var user                  = req.user;
            user.thirty7signals.token = undefined;

            user.save(function (err) {
               res.redirect('/profile');
            });
        });
    };
})();