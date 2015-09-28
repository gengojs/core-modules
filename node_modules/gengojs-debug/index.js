'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports['default'] = debufigy;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _sourceMapSupport = require('source-map-support');

/**
 * Debug is a debug wrapper for gengo.js
 */

var Debug = (function () {
	function Debug(namespace, level, args) {
		var _this = this;

		_classCallCheck(this, Debug);

		(0, _sourceMapSupport.install)();
		this.namespace = namespace;
		this.level = level;
		this.args = args;
		this.debug = (function () {
			var obj = {};
			var gengo = 'gengo';
			var namespaces = ['core', 'parser', 'router', 'backend', 'api', 'localize', 'header'];
			var levels = ['debug', 'warn', 'error', 'info', 'verbose', 'silly'];
			namespaces.forEach(function (namespace) {
				levels.forEach(function (level) {
					var key = gengo + '.' + namespace + ':' + level;
					obj[key] = (0, _debug2['default'])(gengo + '.' + namespace + ':' + level);
				}, this);
			}, _this);
			return obj;
		})();
	}

	/**
  * Wraps 'debug' and outputs the arguments using namespaces.
  * @param {string} namespace - The namespace of the gengo to debug.
  * @param {string} level - The level of debug to output.
  * @param {*} args - The arguments to output.
  * @example 
  *  debugify('core.plugins', 'warn', 'Hello world')
  */

	_createClass(Debug, [{
		key: 'log',
		value: function log() {
			this.debug['gengo' + '.' + this.namespace.toLowerCase() + ':' + this.level.toLowerCase()].apply(null, this.args);
		}
	}]);

	return Debug;
})();

function debufigy(namespace, level) {
	for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
		args[_key - 2] = arguments[_key];
	}

	new Debug(namespace, level, args).log();
}

module.exports = exports['default'];
//# sourceMappingURL=index.js.map