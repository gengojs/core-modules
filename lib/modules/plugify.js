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
      // Type stack to keep track which type has been plugged in
      this.types = ['api', 'backend', 'parser', 'header', 'localize', 'router'];
      // Initialize the plugin
      this.plugins = this.init();
      this.register(plugins, options, defaults);
      this.bundle();
      _.forEach(this.plugins, (value, key) => {
        log.info(
          `class: ${Plugify.name}`,
          `plugins: type - ${key} typeof - ${typeof value}`);
      });
    }
    /**
     * Sets the attributes in the plugin
     * @param {Object} plugin  The plugin to set its attributes.
     * @param {Object} options The options to apply
     */
  setAttributes(plugin, options) {
      log.debug(`class: ${Plugify.name}`, `process: setAttributes`);
      var {
        main, defaults
      } = plugin;
      var {
        name, type
      } = plugin.package;
      type = this.normalize(type);
      // Set the plugin fn
      this.plugins[type][name] = main;
      // Set the package
      this.plugins[type][name].package = plugin.package;
      // Insert plugins as callbacks
      this.plugins[type].push(main);
      // Set the default options by merging with user's
      _.merge(options, {
        [type]: defaults
      }, options);
    }
    /**
     * Normalizes a string
     * @param  {String} str The string to normalize
     * @return {String}     The normalized string
     * @private
     */
  normalize(str) {
      log.debug(`class: ${Plugify.name}`, `process: normalize`);
      return str.toLowerCase().replace('-', '');
    }
    /**
     * Initializes the plugin's stack
     * @return {Object} The plugin statck
     * @private
     */
  init() {
      log.debug(`class: ${Plugify.name}`, `process: init`);
      return _.assign({}, {
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
  plugs(plugins) {
      log.debug(`class: ${Plugify.name}`, `process: plugs`);
      var plugs = [];
      // 'plugins' is a plain object
      if (_.isPlainObject(plugins)) {
        // A single ship exists
        if (_.has(plugins, 'main')) plugs.push(plugins);
        else _.forOwn(plugins, (ship) => {
          try {
            // Assert that ship is a function
            if (!_.isFunction(ship)) throw new Error('Uh oh! The ship must be a function!');
            if (!_.isPlainObject(ship())) throw new Error('Whoops! Did the ship forget to return a plain object?');
          } catch (error) {
            log.error(`class: ${Plugify.name}`,
              `error: ${error.stack || error.toString() }`);
          }
          plugs.push(ship());
        });
      }
      if (_.isArray(plugins)) plugs = plugins;
      if (_.isFunction(plugins)) {
        if (!_.isPlainObject(plugins())) throw new Error('Whoops! Did the ship forget to return a plain object?');
        plugs.push(plugins());
      }
      return plugs;
    }
    /**
     * Asserts the plugin is in proper format.
     * @param {object} plugin - The plugin to assert.
     * @private
     */
  assert(plugin) {
      log.debug(`class: ${Plugify.name}`, `process: assert`);
      try {
        if (_.has(plugin, 'main')) throw new Error('Whoops! Did you forget the main function?');
        if (_.has(plugin, 'package')) throw new Error('Whoops! Did you forget the package?');
        if (_.has(plugin.package, 'type')) throw new Error('Whoops! Did you forget the "type" of plugin?');
        if (_.has(plugin.package, 'name')) throw new Error('Whoops! Did you forget the "name" of plugin?');
        if (!_.has(plugin.package, 'defaults')) throw new Error('Whoops! Did you forget to add "defaults"?');
        if (_.has(plugin, 'defaults')) throw new Error('Whoops! Did you forget to add the "defaults"?');
      } catch (error) {
        log.error(`class: ${Plugify.name}`,
          `error: ${error.stack || error.toString() }`);
      }
    }
    /**
     * Registers the plugin
     * @param  {Object} plugins  The plugin to register
     * @param  {Object} options  The options to apply
     * @param  {Object} defaults The default plugins
     */
  register(plugins, options, defaults) {
      var plugs = this.plugs(plugins);
      // Register and then restrict the
      // plugins to one plugin per type
      // and add defaults if none exist
      _.forEach(plugs, function(plugin) {
        // Assert
        if (!_.isEmpty(defaults)) this.assert(plugin);
        else log
          .warn(`class: ${Plugify.name}`, `process: register`)
          .warn('Defaults is empty! Possibly in testing mode?');
        var type = this.normalize(plugin.package.type);
        // If the default plugin already exists
        // then remove the default and replace it with
        // the user defined plugin
        if (this.plugins[type].length === 1) {
          if (!_.isUndefined(defaults))
            this.plugins[type].pop();
          // Set the plugin attributes
          this.setAttributes(plugin, options);
          // If there are multiple plugins of the same type
          // restrict it to one plugin
        } else if (this.plugins[type].length > 1) {
          var length = this.plugins[type].length - 1;
          while (length !== 0) {
            if (!_.isUndefined(defaults))
              this.plugins[type].pop();
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
  bundle() {
    // Remove the plugin from array
    // and set it as the root
    // e.g. this.plugins.backend => array
    // becomes this.plugins.backend => object
    var plugs = this.plugins;
    _.forEach(plugs, (plugin, type) => {
      if (plugin[0]) {
        // Get the index of the type from the types stack
        var index = this.types.indexOf(this.normalize(type));
        // Remove the type from the stack since it is registered
        if (index > -1) this.types.splice(index, 1);
        // Register the plugin
        this.plugins[this.normalize(type)] = plugin[0];
      }
    });
    // Set the placeholder
    _.forEach(this.types, (type) => {
      this.plugins[this.normalize(type)] = () => {};
    });
  }
}

/**
 * Returns the plugins after creating an instance
 * of Plugify
 * @param  {Object | Function} plugins  [description]
 * @param  {Object} options  The options to apply to the plugins
 * @param  {Object} defaults The default plugins
 * @return {Plugify}         An instance of Plugify
 */
function plugify(plugins, options = {}, defaults = {}) {
  'use strict';
  return new Plugify(plugins, options, defaults).plugins;
}
/**
 * @module plugify
 */
export default plugify;