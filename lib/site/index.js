/**
 * Created by flammenmensch on 18.01.14.
 */
var express = require('express');
var app = express();

var hbs = require('hbs');

var blocks = { };

hbs.registerPartials(__dirname + '/views/partials');

hbs.registerHelper('extend', function (name, context) {
    var block = blocks[name];

    if (!block) {
        block = blocks[name] = [];
    }

    block.push(context.fn(this));
});

hbs.registerHelper('block', function (name) {
    var val = (blocks[name] || []).join('\n');

    blocks[name] = [];
    return val;
});

app.configure(function () {
    app.enable('view cache');
    app.engine('html', hbs.__express);

    app.set('view engine', 'hbs');
    app.set('layout', 'layout');
    app.set('views', __dirname + '/views');

    // Application variables
    app.set('appDomain', 'catvisor.herokuapp.com');
    app.set('appName', 'Котовизор');
    app.set('appDescription', 'Управляемые гифки с котиками');
    app.set('appVersion', 'v0.1.0 &beta;eta');
    app.set('appYear', 2014);
    app.set('fbAppId', process.env.FB_APP_ID);
    app.set('fbAppAdmins', process.env.FB_APP_ADMINS);
    app.set('gaKey', process.env.GA_KEY);

    app.use(express.static(__dirname + '/public'));
});

app.get('/', function (req, res, next) {
    res.render('index', {
        appName: req.app.get('appName'),
        appDescription: req.app.get('appDescription'),
        appDomain: req.app.get('appDomain'),
        appVersion: req.app.get('appVersion'),
        appYear: req.app.get('appYear'),
        fbAppId: req.app.get('fbAppId'),
        fbAppAdmins: req.app.get('fbAppAdmins'),
        gaKey: req.app.get('gaKey'),
        partials: {
            facebookLikeButton: 'facebook-share',
            googleAnalytics: 'google-analytics',
            githubRibbon: 'github-ribbon'
        }
    });
});

app.use(function (err, req, res, next) {
    res.send(500, err.message);
});

module.exports = app;