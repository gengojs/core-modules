/**
 * This module reads or sets the initial options
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _gengojsDebug = require('gengojs-debug');

var _gengojsDebug2 = _interopRequireDefault(_gengojsDebug);

/*
    Definition: Options must be either a string or a plain object.

    1. Options must be an object that specifies the type 
       such as 'parser' or options must be a string that specifies 
       the path to the options file.
       

    Side note: Every plugin created must offer default options and must 
    be responsible with letting the developers know about the options
    for your plugin (through GitHub, etc).
*/

var Optify = function Optify(options) {
  _classCallCheck(this, Optify);

  (0, _gengojsDebug2['default'])('core', 'debug', 'class: ' + Optify.name, 'process: constructor');
  this.options = {};
  var settings;
  try {
    if (_lodash2['default'].isPlainObject(options) && !_lodash2['default'].isEmpty(options)) this.options = options;else if (_lodash2['default'].isString(options)) {
      // Normalize the string and if it ends in yml replace it
      options = _path2['default'].normalize(options.replace('yml', 'yaml'));
      // Load the json or javascript file
      if (/\.json/.test(options) || /\.js/.test(options)) {
        settings = require(options);
        this.options = settings;
      } else if (/\.yaml/.test(options)) {
        // Load yaml
        settings = _jsYaml2['default'].safeLoad(_fs2['default'].readFileSync(options, 'utf8'));
        this.options = settings;
      } else {
        throw new Error('Oops! Did you forgt to add the extension? \n' + 'The supported extensions are .json, .js, and .yaml.');
      }
    } else this.options = settings || {};
  } catch (error) {
    (0, _gengojsDebug2['default'])('core', 'error', 'class: ' + Optify.name, 'error: ' + (error.stack || error.toString()));
  }
};

exports['default'] = function (options) {
  'use strict';
  return new Optify(options).options;
};

module.exports = exports['default'];
//# sourceMappingURL=../source maps/modules/optify.js.map