/**
 * Created by flammenmensch on 11.01.14.
 */
var express = require('express');
var site = require('./lib/site');
var api = require('./lib/api');


var app = express();

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.logger());
    app.use(app.router);

    app.set('httpPort', process.env.PORT);

    app.use(site);
    app.use(api);
});

app.listen(app.get('httpPort'), function (err) {
    if (err) {
        return console.error(err.message);
    }

    console.log('Server started at', app.get('httpPort'));
});