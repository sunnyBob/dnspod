'use strict';

require('babel-polyfill');

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaStatic = require('koa-static');

var _koaStatic2 = _interopRequireDefault(_koaStatic);

var _koaConvert = require('koa-convert');

var _koaConvert2 = _interopRequireDefault(_koaConvert);

var _koaBodyparser = require('koa-bodyparser');

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _send = require('./send');

var _send2 = _interopRequireDefault(_send);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var app = new _koa2.default();

app.use((0, _koaConvert2.default)((0, _koaStatic2.default)('static')));

app.use((0, _koaBodyparser2.default)());

app.use(function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
        var resp, key;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return (0, _send2.default)(ctx.req, ctx.request.body);

                    case 3:
                        resp = _context.sent;

                        for (key in resp.headers) {
                            ctx.set(key, resp.headers[key]);
                        }
                        ctx.body = resp.body;
                        _context.next = 11;
                        break;

                    case 8:
                        _context.prev = 8;
                        _context.t0 = _context['catch'](0);

                        ctx.body = _context.t0;

                    case 11:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[0, 8]]);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}());

//catch uncaughtException
process.on('uncaughtException', function (err) {
    console.log('uncaughtException: ' + err);
});

app.listen(8000);
