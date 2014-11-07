# passport-seed

`passport-seed` is a RESTful authentication starter project that uses Passport.js. Local, Facebook, Google, Twitter, and Basecamp strategies are provided by default. Sessions are persisted via MongoDB.

# Getting Started

To get started, add a `secret.js` file to the `app/config` directory and edit the connection info in `database.js` in the same directory. `secret.js` contains API keys and the session secret used by Express. A template for the file follows.

## secret.js

    (function () {
        'use strict';
    
        module.exports = {
            sessionSecret: 'your-session-secret',
            apiKeys: {
                facebook: {
                    clientID:     'your-facebook-client-id',
                    clientSecret: 'your-facebook-client-secret'
                },
                twitter: {
                    consumerKey:    'your-twitter-consumer-key',
                    consumerSecret: 'your-twitter-consumer-secret'
                },
                google: {
                    clientID:     'your-google-client-id',
                    clientSecret: 'your-google-client-secret'
                },
                basecamp: {
                    clientID:     'your-basecamp-client-id',
                    clientSecret: 'your-basecamp-client-secret'
                }
            }
        };
    })();

## database.js

Edit the `dbName` and `dbUrl` variables to point to your Mongo instance.
    
## Starting the server

    node server.js