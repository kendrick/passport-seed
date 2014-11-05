(function () {
    'use strict';

    var dbName = 'eightyeight';
    var dbUrl  = 'mongodb://localhost:27017/';

    module.exports = {
        'name': dbName,
        'url' : dbUrl + dbName
    };
})();