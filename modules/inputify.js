/**
 * This module extracts the phrase and arguments.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _gengojsDebug = require('gengojs-debug');

var _gengojsDebug2 = _interopRequireDefault(_gengojsDebug);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

/**
 * Extractify
 */

var Extractify = (function () {
  function Extractify(phrase, array) {
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
    // If they are exactly 2 argument
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
    this.phrase = phrase;
    this.values = values;
    this.args = args;
  }

  /**
   * Inputify
   */

  _createClass(Extractify, [{
    key: 'hasValues',
    value: function hasValues() {
      (0, _gengojsDebug2['default'])('core', 'debug', 'class: ' + Extractify.name, 'process: hasValues');
      return !_lodash2['default'].isEmpty(this.values);
    }
  }, {
    key: 'hasArgs',
    value: function hasArgs() {
      (0, _gengojsDebug2['default'])('core', 'debug', 'class: ' + Extractify.name, 'process: hasArgs');
      return !_lodash2['default'].isEmpty(this.args);
    }
  }]);

  return Extractify;
})();

var Inputify = (function () {
  function Inputify(phrase, args) {
    _classCallCheck(this, Inputify);

    (0, _gengojsDebug2['default'])('core', 'debug', 'class: ' + Inputify.name, 'process: constructor');
    this._extract = new Extractify(phrase, args);
    this._phrase = this._extract.phrase;
    this._args = args;
    (0, _gengojsDebug2['default'])('core', 'info', 'class: ' + Inputify.name, '\n\textract: ' + JSON.stringify(this._extract), '\n\tphrase: ' + this._phrase, '\n\targs: ' + JSON.stringify(this._args));
  }

  /**
   * phrase
   * @return {string} - The phrase to internationalize.
   */

  _createClass(Inputify, [{
    key: 'phrase',
    value: function phrase() {
      (0, _gengojsDebug2['default'])('core', 'debug', 'class: ' + Inputify.name, 'process: phrase');
      return this._phrase;
    }

    /**
     * arguments
     * @return {Array} - The original arguments before extraction.
     */
  }, {
    key: 'arguments',
    value: function _arguments() {
      (0, _gengojsDebug2['default'])('core', 'debug', 'class: ' + Inputify.name, 'process: arguments');
      return this._args;
    }

    /**
     * other
     * @return {object} - The other arguments after extraction in
     * the form of an API.
     * @example
     * new Inputify(phrase, args).other().arguments();
     * new Inputify(phrase, args).other().values();
     * new Inputify(phrase, args).other().hasArgs();
     * new Inputfiy(phrase, args).other().hasValues();
     */
  }, {
    key: 'other',
    value: function other() {
      var _this = this;

      (0, _gengojsDebug2['default'])('core', 'debug', 'class: ' + Inputify.name, 'process: other');
      var args = function args() {
        return _this._extract.args;
      };
      var values = function values() {
        return _this._extract.values;
      };
      var hasArgs = function hasArgs() {
        return _this._extract.hasArgs();
      };
      var hasValues = function hasValues() {
        return _this._extract.hasValues();
      };
      return {
        args: args, values: values, hasArgs: hasArgs, hasValues: hasValues
      };
    }
  }]);

  return Inputify;
})();

exports['default'] = function (phrase) {
  'use strict';

  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return new Inputify(phrase, args);
};

module.exports = exports['default'];
//# sourceMappingURL=../source maps/modules/inputify.js.map