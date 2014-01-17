/**
 * Created by flammenmensch on 11.01.14.
 */
var hbs = require('hbs');
var express = require('express');
var routes = require('./routes');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');

var blocks = {};

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
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.logger());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));

    app.enable('view cache');
    app.engine('html', hbs.__express);

    app.set('view engine', 'hbs');
    app.set('layout', 'layout');
    app.set('views', __dirname + '/views');

    // Application variables
    app.set('httpPort', process.env.PORT || 5000);
    app.set('giphyApiKey', process.env.GIPHY_API_KEY || 'dc6zaTOxFJmzC');
    app.set('appDomain', 'catvisor.herokuapp.com');
    app.set('appName', 'Котовизор');
    app.set('appDescription', 'Управляемые гифки с котиками');
    app.set('appVersion', 'v0.1.0 &beta;eta');
    app.set('appYear', 2014);
    app.set('fbAppId', '446934475434579');
    app.set('fbAppAdmins', '702524723');
    app.set('googleAnalyticsId', 'UA-47047792-1');
});

app.get('/', routes.site.index);
app.get('/api', routes.api.random);
app.get('/api/:id', routes.api.loadById);

app.use(function (err, req, res, next) {
    if (req.xhr) {
        return res.json(500, { error: true, message: err.message });
    }

    res.send(500, err.message);
});

app.listen(app.get('httpPort'), function (err) {
    if (err) {
        return console.error(err.message);
    }

    console.log('Server started at', app.get('httpPort'));
});