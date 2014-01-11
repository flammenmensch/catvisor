/**
 * Created by flammenmensch on 11.01.14.
 */
var express = require('express');
var hogan = require('hogan-express');
var routes = require('./routes');

var HTTP_PORT = process.env.HTTP_PORT || 5000;
var app = express();

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.logger());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));

    app.set('view engine', 'html');
    app.set('layout', 'layout');
    app.set('views', __dirname + '/views');

    app.set('domain', 'catvisor.aws.af.cm');
    app.set('name', 'Котовизор');
    app.set('version', 'v1.0.0 &alpha;lpha');
    app.set('year', 2014);

    app.enable('view cache');

    app.engine('html', hogan);
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

app.listen(HTTP_PORT, function (err) {
    console.log('Server started');
});