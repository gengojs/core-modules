'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _gengojsDebug = require('gengojs-debug');

var _gengojsDebug2 = _interopRequireDefault(_gengojsDebug);

var log = (0, _gengojsDebug2['default'])('core');
/**
 * This class determines whether the
 * plugins are properly shipped and
 * sets them for the core.
 * @class Plugify
 */

var Plugify = (function () {
  function Plugify(plugins, options, defaults) {
    _classCallCheck(this, Plugify);

    log.debug('class: ' + Plugify.name, 'process: constructor');
    // Type stack to keep track which type has been plugged in
    this.types = ['api', 'backend', 'parser', 'header', 'localize', 'router'];
    // Initialize the plugin
    this.plugins = this.init();
    this.register(plugins, options, defaults);
    this.bundle();
    _lodash2['default'].forEach(this.plugins, function (value, key) {
      log.info('class: ' + Plugify.name, 'plugins: type - ' + key + ' typeof - ' + typeof value);
    });
  }

  /**
   * Returns the plugins after creating an instance
   * of Plugify
   * @param  {Object | Function} plugins  [description]
   * @param  {Object} options  The options to apply to the plugins
   * @param  {Object} defaults The default plugins
   * @return {Plugify}         An instance of Plugify
   */

  /**
   * Sets the attributes in the plugin
   * @param {Object} plugin  The plugin to set its attributes.
   * @param {Object} options The options to apply
   */

  _createClass(Plugify, [{
    key: 'setAttributes',
    value: function setAttributes(plugin, options) {
      log.debug('class: ' + Plugify.name, 'process: setAttributes');
      var main = plugin.main;
      var defaults = plugin.defaults;
      var _plugin$package = plugin['package'];
      var name = _plugin$package.name;
      var type = _plugin$package.type;

      type = this.normalize(type);
      // Set the plugin fn
      this.plugins[type][name] = main;
      // Set the package
      this.plugins[type][name]['package'] = plugin['package'];
      // Insert plugins as callbacks
      this.plugins[type].push(main);
      // Set the default options by merging with user's
      _lodash2['default'].merge(options, _defineProperty({}, type, defaults), options);
    }

    /**
     * Normalizes a string
     * @param  {String} str The string to normalize
     * @return {String}     The normalized string
     * @private
     */
  }, {
    key: 'normalize',
    value: function normalize(str) {
      log.debug('class: ' + Plugify.name, 'process: normalize');
      return str.toLowerCase().replace('-', '');
    }

    /**
     * Initializes the plugin's stack
     * @return {Object} The plugin statck
     * @private
     */
  }, {
    key: 'init',
    value: function init() {
      log.debug('class: ' + Plugify.name, 'process: init');
      return _lodash2['default'].assign({}, {
        parser: [],
        router: [],
        backend: [],
        api: [],
        header: [],
        localize: []
      });
    }

    /**
     * Asserts that the plugins follows the definition and
     * creates an array of plugin(s)
     * @param {Object | Array| Function} plugins - The plugins to assert.
     * @return {Array} An array of plugins
     */
  }, {
    key: 'plugs',
    value: function plugs(plugins) {
      log.debug('class: ' + Plugify.name, 'process: plugs');
      var plugs = [];
      // 'plugins' is a plain object
      if (_lodash2['default'].isPlainObject(plugins)) {
        // A single ship exists
        if (_lodash2['default'].has(plugins, 'main')) plugs.push(plugins);else _lodash2['default'].forOwn(plugins, function (ship) {
          try {
            // Assert that ship is a function
            if (!_lodash2['default'].isFunction(ship)) throw new Error('Uh oh! The ship must be a function!');
            if (!_lodash2['default'].isPlainObject(ship())) throw new Error('Whoops! Did the ship forget to return a plain object?');
          } catch (error) {
            log.error('class: ' + Plugify.name, 'error: ' + (error.stack || error.toString()));
          }
          plugs.push(ship());
        });
      }
      if (_lodash2['default'].isArray(plugins)) plugs = plugins;
      if (_lodash2['default'].isFunction(plugins)) {
        if (!_lodash2['default'].isPlainObject(plugins())) throw new Error('Whoops! Did the ship forget to return a plain object?');
        plugs.push(plugins());
      }
      return plugs;
    }

    /**
     * Asserts the plugin is in proper format.
     * @param {object} plugin - The plugin to assert.
     * @private
     */
  }, {
    key: 'assert',
    value: function assert(plugin) {
      log.debug('class: ' + Plugify.name, 'process: assert');
      try {
        if (_lodash2['default'].has(plugin, 'main')) throw new Error('Whoops! Did you forget the main function?');
        if (_lodash2['default'].has(plugin, 'package')) throw new Error('Whoops! Did you forget the package?');
        if (_lodash2['default'].has(plugin['package'], 'type')) throw new Error('Whoops! Did you forget the "type" of plugin?');
        if (_lodash2['default'].has(plugin['package'], 'name')) throw new Error('Whoops! Did you forget the "name" of plugin?');
        if (!_lodash2['default'].has(plugin['package'], 'defaults')) throw new Error('Whoops! Did you forget to add "defaults"?');
        if (_lodash2['default'].has(plugin, 'defaults')) throw new Error('Whoops! Did you forget to add the "defaults"?');
      } catch (error) {
        log.error('class: ' + Plugify.name, 'error: ' + (error.stack || error.toString()));
      }
    }

    /**
     * Registers the plugin
     * @param  {Object} plugins  The plugin to register
     * @param  {Object} options  The options to apply
     * @param  {Object} defaults The default plugins
     */
  }, {
    key: 'register',
    value: function register(plugins, options, defaults) {
      var plugs = this.plugs(plugins);
      // Register and then restrict the
      // plugins to one plugin per type
      // and add defaults if none exist
      _lodash2['default'].forEach(plugs, function (plugin) {
        // Assert
        if (!_lodash2['default'].isEmpty(defaults)) this.assert(plugin);else log.warn('class: ' + Plugify.name, 'process: register').warn('Defaults is empty! Possibly in testing mode?');
        var type = this.normalize(plugin['package'].type);
        // If the default plugin already exists
        // then remove the default and replace it with
        // the user defined plugin
        if (this.plugins[type].length === 1) {
          if (!_lodash2['default'].isUndefined(defaults)) this.plugins[type].pop();
          // Set the plugin attributes
          this.setAttributes(plugin, options);
          // If there are multiple plugins of the same type
          // restrict it to one plugin
        } else if (this.plugins[type].length > 1) {
            var length = this.plugins[type].length - 1;
            while (length !== 0) {
              if (!_lodash2['default'].isUndefined(defaults)) this.plugins[type].pop();
              length--;
            }
            // Since no there are no default plugins,
            // just add the plugin to the stack
          } else {
              this.setAttributes(plugin, options);
            }
      }, this);
    }

    /**
     * Bundles the plugins and transforms the plugin
     * stack from an array to an object. It also makes sure
     * that the stack has a fn placeholder to prevent an undefined
     * object from being used as a function
     * @private
     */
  }, {
    key: 'bundle',
    value: function bundle() {
      var _this = this;

      // Remove the plugin from array
      // and set it as the root
      // e.g. this.plugins.backend => array
      // becomes this.plugins.backend => object
      var plugs = this.plugins;
      _lodash2['default'].forEach(plugs, function (plugin, type) {
        if (plugin[0]) {
          // Get the index of the type from the types stack
          var index = _this.types.indexOf(_this.normalize(type));
          // Remove the type from the stack since it is registered
          if (index > -1) _this.types.splice(index, 1);
          // Register the plugin
          _this.plugins[_this.normalize(type)] = plugin[0];
        }
      });
      // Set the placeholder
      _lodash2['default'].forEach(this.types, function (type) {
        _this.plugins[_this.normalize(type)] = function () {};
      });
    }
  }]);

  return Plugify;
})();

function plugify(plugins) {
  'use strict';
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var defaults = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  return new Plugify(plugins, options, defaults).plugins;
}
/**
 * @module plugify
 */
exports['default'] = plugify;
module.exports = exports['default'];
//# sourceMappingURL=../source maps/modules/plugify.js.map
