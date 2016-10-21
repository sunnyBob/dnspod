'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = send;

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DNSPOD_API_BASE = 'https://dnsapi.cn';

var parseUrl = function parseUrl(url) {
    return DNSPOD_API_BASE + url;
};

function send(httpReq, form) {
    var method = httpReq.method.toLowerCase();
    return new Promise(function (resolve, reject) {
        try {
            (function () {
                var url = parseUrl(httpReq.url);
                var startTime = new Date().getTime();
                console.log('sending:', url);
                _request2.default[method]({ url: url, form: form }, function (error, resp, body) {
                    var headers = resp.headers;
                    if (!error) {
                        resolve({ body: body, headers: headers });
                    } else {
                        reject(error);
                    }
                    console.log('send success:', url, new Date().getTime() - startTime + 'ms');
                });
            })();
        } catch (e) {
            reject(e);
        }
    });
}