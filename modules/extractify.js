'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _gengojsDebug = require('gengojs-debug');

var _gengojsDebug2 = _interopRequireDefault(_gengojsDebug);

/**
 * This class extracts the input and seperates the arguments
 * into phrase, args, and values.
 * @class
 */

var Extractify = function Extractify(phrase, array) {
  _classCallCheck(this, Extractify);

  (0, _gengojsDebug2['default'])('core', 'debug', 'class: ' + Extractify.name, 'process: constructor');
  var values = {},
      args = [],
      value,
      length = array ? array.length : 0;
  (0, _gengojsDebug2['default'])('core', 'debug', 'class: ' + Extractify.name, 'array: ' + JSON.stringify(array), 'length: ' + length);
  // If the arguments is greater than 2 (because of offset)
  if (length > 1) {
    // Just append them to the array
    array.forEach(function (item) {
      return args.push(item);
    });
  }
  // If they are exactly 2 arguments
  else if (length === 1) {
      // Get the first value
      value = array[0];
      // Set arguments [...]
      if (_lodash2['default'].isArray(value)) args = value;else if (_lodash2['default'].isPlainObject(value)) args = [];else args.push(value);
      // Set values {...}
      values = _lodash2['default'].isPlainObject(value) ? value : {};
    }
  // If called like __({phrase:'hello', locale:'en'})
  if (_lodash2['default'].isPlainObject(phrase) && !_lodash2['default'].isEmpty(values)) {
    if (_lodash2['default'].has(phrase, 'locale')) values.locale = phrase.locale;
    if (_lodash2['default'].has(phrase, 'phrase')) phrase = phrase.phrase;
  }
  this.extracts = {
    phrase: phrase, values: values, args: args
  };
};

exports['default'] = Extractify;
module.exports = exports['default'];
//# sourceMappingURL=../source maps/modules/extractify.js.map
