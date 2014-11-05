(function () {
    'use strict';

    var secret = require('./secret');
    var BASE_CALLBACK_URL = 'http://localhost:8080/auth';

    module.exports = {
        'facebookAuth' : {
            'clientID'     : secret.apiKeys.facebook.clientID,
            'clientSecret' : secret.apiKeys.facebook.clientSecret,
            'callbackURL'  : BASE_CALLBACK_URL + '/facebook/callback'
        },

        'twitterAuth' : {
            'consumerKey'    : secret.apiKeys.twitter.consumerKey,
            'consumerSecret' : secret.apiKeys.twitter.consumerSecret,
            'callbackURL'    : BASE_CALLBACK_URL + '/twitter/callback'
        },

        'googleAuth' : {
            'clientID'     : secret.apiKeys.google.clientID,
            'clientSecret' : secret.apiKeys.google.clientSecret,
            'callbackURL'  : BASE_CALLBACK_URL + '/google/callback'
        },

        'basecamp' : {
            'clientID'     : secret.apiKeys.basecamp.clientID,
            'clientSecret' : secret.apiKeys.basecamp.clientSecret,
            'callbackURL'  : BASE_CALLBACK_URL + '/basecamp/callback'
        }
    };
})();