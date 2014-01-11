/**
 * Created by flammenmensch on 11.01.14.
 */
var http = require('http');
var Giphy = require('./giphy').Giphy;

var API_KEY = process.env.GIPHY_API_KEY;

var giphyService = new Giphy(API_KEY);

module.exports = {

    site: {
        index: function (req, res, next) {
            res.render('index', {
                appName: 'Котовизор',
                appDomain: 'catvisor.aws.af.cm',
                appVersion: '0.0.1 &alpha;lpha',
                appYear: '2014'
            });
        }
    },

    api: {
        random: function (req, res, next) {
            var tags = req.query.tag || 'cat';

            giphyService.random(tags, function (err, data) {
                if (err) {
                    return next(err);
                }

                return res.json(200, { error: false, data: data.data });
            });
        },

        loadById: function (req, res, next) {
            var id = req.param('id');

            giphyService.loadById(id, function (err, data) {
                if (err) {
                    return next(err);
                }

                if (!data.length) {
                    return next(new Error('GIF not found'));
                }

                return res.json(200, { error: false, data: data.data });
            });
        }
    }
};