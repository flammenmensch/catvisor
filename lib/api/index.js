/**
 * Created by flammenmensch on 18.01.14.
 */
var express = require('express');
var app = express();
var GiphyService = require('./giphy').GiphyService;

app.configure(function () {
    app.set('giphyApiKey', process.env.GIPHY_API_KEY);
});

var giphy = new GiphyService(app.get('giphyApiKey'));

app.get('/api', function (req, res, next) {
    var tags = req.query.tag || 'cat';

    giphy.random(tags, function (err, data) {
        if (err) {
            return next(err);
        }

        return res.json(200, { error: false, data: data.data });
    });
});

app.get('/api/random', function (req, res, next) {
    var full = req.query.full === 'true';
    var tags = req.query.tag || 'cat';

    giphy.random(tags, function (err, data) {
        if (err) {
            return next(err);
        }

        if (!full) {
            return res.json(200, { error: false, data: data.data });
        }

        giphy.loadById(data.data.id, function (err, data) {
           if (err) {
                return next(err);
           }

            return res.json(200, { error: false, data: data.data });
        });
    });
});

app.get('/api/:id', function (req, res, next) {
    var id = req.param('id');

    giphy.loadById(id, function (err, data) {
        if (err) {
            return next(err);
        }

        return res.json(200, { error: false, data: data.data });
    });
});

app.use(function (err, req, res, next) {
    return res.json(500, { error: true, message: err.message });
});

module.exports = app;