import _ from 'lodash';
import debug from 'gengojs-debug';
let log = debug('core');
/**
 * This class determines whether the
 * plugins are properly shipped and
 * sets them for the core.
 * @class Plugify
 */
class Plugify {
  constructor(plugins, options, defaults) {
      log.debug(`class: ${Plugify.name}`, `process: constructor`);
      // Local options
      this.options = {};
      this.defaults = {};
      // Initialize the plugins
      this.plugins = (() => {
        if (_.isEmpty(defaults)) {
          _.forEach(['api', 'backend', 'parser', 'header', 'localize', 'router'], item => {
            this.defaults[this.normalize(item)] = () => {};
          });
          return this.defaults;
        }
        _.forOwn(defaults, (value, key) => {
          if (_.isFunction(value) && _.isPlainObject(value()))
            this.defaults[key] = value();
        });
        return this.defaults;
      })();
      this.register(plugins);
      _.forOwn(this.plugins, (value, key) => {
        var name = value.package ? value.package.name : '';
        log.info(
          `class: ${Plugify.name}`,
          `plugins: name - ${name}, type - ${key}, typeof - ${typeof value}`);
      });
      _.defaultsDeep(options, this.options);
    }
    /**
     * Registers the plugin
     * @param {Function | Array | Object} The plugin to register
     */
  register(plugins) {
      log.debug(`class: ${Plugify.name}`, `process: register`);
      var process = (plugin) => {
        if (_.isPlainObject(plugin)) {
          if (!_.has(plugin, 'main') && (() => {
              return _.forEach(Object.keys(plugin), key =>
                key === 'api' || key === 'parser' || key === 'backend' ||
                key === 'header' || key === 'localize' || key === 'router');
            })()) {
            if (_.forOwn(plugin, value => this.assert((() => {
                return _.isFunction(value) ? value() :
                  _.isPlainObject(value) ? value : undefined;
              })())))
              _.forOwn(plugin, value => {
                value = _.isFunction(value) ? value() :
                  _.isPlainObject(value) ? value : undefined;
                this.setPlugin(value);
              });
          } else {
            if (this.assert(plugin)) {
              this.setPlugin(plugin);
            }
          }
        }
      };
      if (_.isArray(plugins)) {
        _.forEach(plugins, plugin => {
          plugin = _.isFunction(plugin) ? plugin() :
            _.isPlainObject(plugin) ? plugin : undefined;
          process(plugin);
        });
      } else if (_.isFunction(plugins)) {
        process(plugins());
      } else if (_.isPlainObject(plugins)) process(plugins);
    }
    /**
     * Sets the attributes of the plugin
     * @param {Object} plugin  The plugin to set its attributes.
     * @param {Object} options The options to apply
     */
  setPlugin(plugin) {
      log.debug(`class: ${Plugify.name}`, `process: setPlugin`);
      var {
        main, defaults
      } = plugin;
      var {
        type
      } = plugin.package;
      type = this.normalize(type);
      if (this.plugins[type]) this.plugins[type] = {};
      // Set the plugin fn
      this.plugins[type] = main;
      // Set the package
      this.plugins[type].package = plugin.package;
      // Set the default options
      if (!this.options[type])
        this.options[type] = defaults;
    }
    /**
     * Normalizes a string
     * @param  {String} str The string to normalize
     * @return {String}     The normalized string
     * @private
     */
  normalize(str) {
      return str.toLowerCase().replace('-', '');
    }
    /**
     * Asserts the plugin is in proper format.
     * @param {object} plugin - The plugin to assert.
     * @private
     */
  assert(plugin) {
    log.debug(`class: ${Plugify.name}`, `process: assert`);
    try {
      if (!plugin) throw new Error('Whoops! Did you forget to ship your plugin?');
      if (!_.has(plugin, 'main')) throw new Error('Whoops! Did you forget the main function?');
      if (!_.has(plugin, 'package')) throw new Error('Whoops! Did you forget the package?');
      if (!_.has(plugin.package, 'type')) throw new Error('Whoops! Did you forget the "type" of plugin?');
      if (!_.has(plugin.package, 'name')) throw new Error('Whoops! Did you forget the "name" of plugin?');
      if (!_.has(plugin, 'defaults')) throw new Error('Whoops! Did you forget to add the "defaults"?');
    } catch (error) {
      log.error(`class: ${Plugify.name}`,
        error.stack || error.toString());
      return false;
    }
    return true;
  }
}

/**
 * Returns the plugins after creating an instance
 * of Plugify
 * @param  {Object | Function | Array} plugins  The user plugins or plugins to override the default
 * @param  {Object} options  The options to apply to the plugins
 * @param  {Object} defaults The default plugins
 * @return {Plugify}         An instance of Plugify
 */
function plugify(plugins = {}, options = {}, defaults = {}) {
  'use strict';
  return new Plugify(plugins, options, defaults).plugins;
}
/**
 * @module plugify
 */
export default plugify;