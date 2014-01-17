/**
 * Created by flammenmensch on 11.01.14.
 */
var http = require('http');

var GiphyService = require('./lib/giphy').GiphyService;

var giphy = new GiphyService(process.env.GIPHY_API_KEY);

module.exports = {

    site: {
        index: function (req, res, next) {
            res.render('index', {
                appName: req.app.get('appName'),
                appDescription: req.app.get('appDescription'),
                appDomain: req.app.get('appDomain'),
                appVersion: req.app.get('appVersion'),
                appYear: req.app.get('appYear'),
                fbAppId: req.app.get('fbAppId'),
                fbAppAdmins: req.app.get('fbAppAdmins'),
                partials: {
                    facebookLikeButton: 'facebook-share',
                    googleAnalytics: 'google-analytics',
                    githubRibbon: 'github-ribbon'
                }
            });
        }
    },

    api: {
        random: function (req, res, next) {
            var tags = req.query.tag || 'cat';

            giphy.random(tags, function (err, data) {
                if (err) {
                    return next(err);
                }

                return res.json(200, { error: false, data: data.data });
            });
        },

        loadById: function (req, res, next) {
            var id = req.param('id');

            giphy.loadById(id, function (err, data) {
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