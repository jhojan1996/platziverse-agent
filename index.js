'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debug = require('debug')('platziverse:agent');
var os = require('os');
var util = require('util');
var mqtt = require('mqtt');
var defaults = require('defaults');
var EventEmitter = require('events');
var uuid = require('uuid');

var _require = require('./utils'),
    parsePayload = _require.parsePayload;

var options = {
  name: 'undefined',
  username: 'platzi',
  interval: 5000,
  mqtt: {
    host: 'mqtt://localhost'
  }
};

var PlatziverseAgent = function (_EventEmitter) {
  _inherits(PlatziverseAgent, _EventEmitter);

  function PlatziverseAgent(opts) {
    _classCallCheck(this, PlatziverseAgent);

    var _this = _possibleConstructorReturn(this, (PlatziverseAgent.__proto__ || Object.getPrototypeOf(PlatziverseAgent)).call(this));

    _this._options = defaults(opts, options);
    _this._started = false;
    _this._timer = null;
    _this._client = null;
    _this._agentId = null;
    _this._metrics = new Map();
    return _this;
  }

  _createClass(PlatziverseAgent, [{
    key: 'addMetric',
    value: function addMetric(type, fn) {
      this._metrics.set(type, fn);
    }
  }, {
    key: 'removeMetric',
    value: function removeMetric(type) {
      this._metrics.delete(type);
    }
  }, {
    key: 'connect',
    value: function connect() {
      var _this2 = this;

      if (!this._started) {
        var opts = this._options;
        this._client = mqtt.connect(opts.mqtt.host);
        this._started = true;
        this._client.subscribe('agent/message');
        this._client.subscribe('agent/connected');
        this._client.subscribe('agent/disconnected');

        this._client.on('connect', function () {
          _this2._agentId = uuid.v4();

          _this2.emit('connected', _this2._agentId);
          _this2._timer = setInterval(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var message, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step$value, metric, fn;

            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (!(_this2._metrics.size > 0)) {
                      _context.next = 37;
                      break;
                    }

                    message = {
                      agent: {
                        uuid: _this2._agentId,
                        username: opts.username,
                        name: opts.name,
                        hostname: os.hostname() || 'localhost',
                        pid: process.pid
                      },
                      metrics: [],
                      timestapm: new Date().getTime()
                    };
                    _iteratorNormalCompletion = true;
                    _didIteratorError = false;
                    _iteratorError = undefined;
                    _context.prev = 5;
                    _iterator = _this2._metrics[Symbol.iterator]();

                  case 7:
                    if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                      _context.next = 20;
                      break;
                    }

                    _step$value = _slicedToArray(_step.value, 2), metric = _step$value[0], fn = _step$value[1];

                    if (fn.length === 1) {
                      fn = util.promisify(fn);
                    }

                    _context.t0 = message.metrics;
                    _context.t1 = metric;
                    _context.next = 14;
                    return Promise.resolve(fn());

                  case 14:
                    _context.t2 = _context.sent;
                    _context.t3 = {
                      type: _context.t1,
                      value: _context.t2
                    };

                    _context.t0.push.call(_context.t0, _context.t3);

                  case 17:
                    _iteratorNormalCompletion = true;
                    _context.next = 7;
                    break;

                  case 20:
                    _context.next = 26;
                    break;

                  case 22:
                    _context.prev = 22;
                    _context.t4 = _context['catch'](5);
                    _didIteratorError = true;
                    _iteratorError = _context.t4;

                  case 26:
                    _context.prev = 26;
                    _context.prev = 27;

                    if (!_iteratorNormalCompletion && _iterator.return) {
                      _iterator.return();
                    }

                  case 29:
                    _context.prev = 29;

                    if (!_didIteratorError) {
                      _context.next = 32;
                      break;
                    }

                    throw _iteratorError;

                  case 32:
                    return _context.finish(29);

                  case 33:
                    return _context.finish(26);

                  case 34:

                    debug('Sending: ' + message);
                    _this2._client.publish('agent/message', JSON.stringify(message));
                    _this2.emit('message', message);

                  case 37:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, _this2, [[5, 22, 26, 34], [27,, 29, 33]]);
          })), opts.interval);
        });

        this._client.on('message', function (topic, payload) {
          payload = parsePayload(payload);
          var broadcast = false;

          switch (topic) {
            case 'agent/connected':
            case 'agent/disconnected':
            case 'agent/message':
              broadcast = payload && payload.agent && payload.agent.uuid !== _this2._agentId;
              break;
          }

          if (broadcast) {
            _this2.emit(topic, payload);
          }
        });

        this._client.on('error', function () {
          return _this2.disconnect;
        });
      }
    }
  }, {
    key: 'disconnect',
    value: function disconnect() {
      if (this._started) {
        clearInterval(this._timer);
        this._started = false;
        this.emit('disconnected', this._agentId);
        this._client.end();
      }
    }
  }]);

  return PlatziverseAgent;
}(EventEmitter);

module.exports = PlatziverseAgent;