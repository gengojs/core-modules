/**
 * This module initializes the plugins.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _gengojsDebug = require('gengojs-debug');

var _gengojsDebug2 = _interopRequireDefault(_gengojsDebug);

var Plugify = (function () {
  function Plugify(plugins, options, defaults) {
    _classCallCheck(this, Plugify);

    (0, _gengojsDebug2['default'])('core', 'debug', 'class: ' + Plugify.name, 'process: constructor');
    // Type stack to keep track which type has been plugged in
    this.types = ['api', 'backend', 'parser', 'header', 'localize', 'router'];
    // Initialize the plugin
    this.plugins = this.init();
    this.register(plugins, options, defaults);
    this.bundle();
    _lodash2['default'].forEach(this.plugins, function (value, key) {
      (0, _gengojsDebug2['default'])('core', 'info', 'class: ' + Plugify.name, 'plugins: ' + key);
    });
  }

  _createClass(Plugify, [{
    key: 'setAttributes',
    value: function setAttributes(plugin, options) {
      (0, _gengojsDebug2['default'])('core', 'debug', 'class: ' + Plugify.name, 'process: setAttributes');
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
      options[type] = _lodash2['default'].defaults(options, defaults);
    }

    /* Normalizes a string */
  }, {
    key: 'normalize',
    value: function normalize(str) {
      (0, _gengojsDebug2['default'])('core', 'debug', 'class: ' + Plugify.name, 'process: normalize');
      return str.toLowerCase().replace('-', '');
    }

    // Initialize
  }, {
    key: 'init',
    value: function init() {
      (0, _gengojsDebug2['default'])('core', 'debug', 'class: ' + Plugify.name, 'process: init');
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
     * plugs asserts that the plugins follows the criteria and
     * creates an array of plugin(s)
     * @param {object|Array|Function} plugins - The plugins to assert.
     * @return {Array} An array of plugins
     */
  }, {
    key: 'plugs',
    value: function plugs(plugins) {
      (0, _gengojsDebug2['default'])('core', 'debug', 'class: ' + Plugify.name, 'process: plugs');
      var plugs = [];
      // 'plugins' is a plain object
      if (_lodash2['default'].isPlainObject(plugins)) {
        // A single ship exists
        if (_lodash2['default'].has(plugins, 'main')) plugs.push(plugins);else _lodash2['default'].forOwn(plugins, function (ship) {
          try {
            // Assert that ship is a function
            if (!_lodash2['default'].isFunction(ship)) throw new Error('Uh oh! The ship must be a function!');
            if (!_lodash2['default'].isPlainObject(ship())) throw new Error('Woops! Did the ship forget to return a plain object?');
          } catch (error) {
            (0, _gengojsDebug2['default'])('core', 'error', 'class: ' + Plugify.name, 'error: ' + (error.stack || error.toString()));
          }
          plugs.push(ship());
        });
      }
      if (_lodash2['default'].isArray(plugins)) plugs = plugins;
      if (_lodash2['default'].isFunction(plugins)) {
        if (!_lodash2['default'].isPlainObject(plugins())) throw new Error('Woops! Did the ship forget to return a plain object?');
        plugs.push(plugins());
      }
      return plugs;
    }

    /**
     * 'assert' asserts the plugin and makes sure that the plugin
     * is in proper fomrat.
     * @param {object} plugin - The plugin to assert.
     */
  }, {
    key: 'assert',
    value: function assert(plugin) {
      (0, _gengojsDebug2['default'])('core', 'debug', 'class: ' + Plugify.name, 'process: assert');
      try {
        if (_lodash2['default'].has(plugin, 'main')) throw new Error('Woops! Did you forget the main function?');
        if (_lodash2['default'].has(plugin, 'package')) throw new Error('Woops! Did you forget the package?');
        if (_lodash2['default'].has(plugin['package'], 'type')) throw new Error('Woops! Did you forget the "type" of plugin?');
        if (_lodash2['default'].has(plugin['package'], 'name')) throw new Error('Woops! Did you forget the "name" of plugin?');
        if (!_lodash2['default'].has(plugin['package'], 'defaults')) throw new Error('Woops! Did you forget to add "defaults"?');
        if (_lodash2['default'].has(plugin, 'defaults')) throw new Error('Woops! Did you forget to add the "defaults"?');
      } catch (error) {
        (0, _gengojsDebug2['default'])('core', 'error', 'class: ' + Plugify.name, 'error: ' + (error.stack || error.toString()));
      }
    }

    /**
     * @private
     * 'register' registers the plugins and sets the attributes.
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
        this.assert(plugin);
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
     * @private
     * 'bundle' bundles the plugins and transforms the plugin
     * stack from an array to an object. It also makes sure
     * that the stack has a fn placeholder to prevent an undefined
     * object from being used as a function
     */
  }, {
    key: 'bundle',
    value: function bundle() {
      // Remove the plugin from array
      // and set it as the root
      // e.g. this.plugins.backend => array
      // becomes this.plugins.backend => object
      var plugs = this.plugins;
      for (var key in plugs) {
        if (plugs.hasOwnProperty(key)) {
          var element = plugs[key];
          if (element[0]) {
            // Get the type
            var type = element[0]['package'].type;

            // Get the index of the type from the types stack
            var index = this.types.indexOf(this.normalize(type));
            // Remove the type from the stack since it is registered
            if (index > -1) this.types.splice(index, 1);
            // Register the plugin
            this.plugins[this.normalize(type)] = element[0];
          } else {
            if (!_lodash2['default'].isEmpty(this.types)) {
              // Get a random type from the stack and
              // set a placeholder plugin in case it doesn't exist
              this.plugins[this.normalize(this.types[0])] = function () {};
              // Remove the type from the stack
              this.types.pop();
            }
          }
        }
      }
    }
  }]);

  return Plugify;
})();

exports['default'] = function (plugins, options, defaults) {
  'use strict';
  return new Plugify(plugins, options, defaults).plugins;
};

module.exports = exports['default'];
//# sourceMappingURL=../../source maps/modules/plugify/index.js.map