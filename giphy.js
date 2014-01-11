/**
 * Created by flammenmensch on 11.01.14.
 */
var http = require('http');

var Giphy = function (key) {
    var apiKey = key;

    var makeHttpRequest = function (url, callback) {
        var request = http.get(url, function (response) {
            if (response.statusCode !== 200) {
                return callback(new Error('Giphy API Error'));
            }

            var str = '';

            response.on('data', function (chunk) {
                str = str.concat(chunk);
            });

            response.on('end', function () {
                callback(null, str);
            });
        });

        request.on('error', function (err) {
            return next(err);
        });

        request.end();
    };

    this.random = function (tags, callback) {
        makeHttpRequest('http://api.giphy.com/v1/gifs/random?api_key=' + apiKey + '&tag=' + tags, function (err, res) {
            callback(null, JSON.parse(res));
        });
    };

    this.loadById = function (id, callback) {
        makeHttpRequest('http://api.giphy.com/v1/gifs/' + id + '?api_key=' + apiKey, function (err, res) {
            callback(null, JSON.parse(res));
        });
    };
};

module.exports.Giphy = Giphy;