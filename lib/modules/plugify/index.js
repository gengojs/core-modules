/**
 * This module initializes the plugins.
 */
import _ from 'lodash';
import debug from 'gengojs-debug';

class Plugify {
  constructor(plugins, options, defaults) {
    debug('core', 'debug', `class: ${Plugify.name}`, `process: constructor`);
    // Initialize the plugin
    this.plugins = this.init();
    var plugs = this.plugs(plugins);
      // Register and then restrict the
      // plugins to one plugin per type
      // and add defaults if none exist
      _.forEach(plugs, function(plugin) {
        // Assert
        this.assert(plugin);
        var type = this.normalize(plugin.package.type);
        // If the default plugin already exists
        // then remove the default and replace it with
        // the user defined plugin
        if (this.plugins[type].length === 1) {
          if(!_.isUndefined(defaults))
            this.plugins[type].pop();
          // Set the plugin attributes
          this.setAttributes(plugin, options);
          // If there are multiple plugins of the same type
          // restrict it to one plugin
        } else if (this.plugins[type].length > 1) {
          var length = this.plugins[type].length - 1;
          while (length !== 0) {
            if(!_.isUndefined(defaults))
              this.plugins[type].pop();
            length--;
          }
          // Since no there are no default plugins,
          // just add the plugin to the stack
        }else{
          this.setAttributes(plugin, options);
        }
      }, this);
      debug('core', 'info', 
        `class: ${Plugify.name}`, `plugins: ${this.plugins}`);
  }

  setAttributes(plugin, options) {
    debug('core', 'debug', `class: ${Plugify.name}`, `process: setAttributes`);
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
    options[type] = _.defaults(options, defaults);
  }
  /* Normalizes a string */
  normalize(str) {
    debug('core', 'debug', `class: ${Plugify.name}`, `process: normalize`);
    return str.toLowerCase().replace('-', '');
  }
  // Initialize
  init() {
    debug('core', 'debug', `class: ${Plugify.name}`, `process: init`);
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
   * plugs asserts that the plugins follows the criteria and
   * creates an array of plugin(s)
   * @param {object|Array|Function} plugins - The plugins to assert.
   * @return {Array} An array of plugins
   */
  plugs (plugins){
    debug('core', 'debug', `class: ${Plugify.name}`, `process: plugs`);
    var plugs = [];
      // 'plugins' is a plain object
      if (_.isPlainObject(plugins)){
        // A single ship exists
        if (_.has(plugins, 'main')) plugs.push(plugins);
        else _.forOwn(plugins, (ship)=>{
           try {
             // Assert that ship is a function
             if (!_.isFunction(ship)) throw new Error
              ('Uh oh! The ship must be a function!');
            if (!_.isPlainObject(ship())) throw new Error
              ('Woops! Did the ship forget to return a plain object?');
           } catch (error) {
              debug('core', 'error', `class: ${Plugify.name}`, 
                `error: ${error.stack || error.toString()}`);  
           }
           plugs.push(ship());
        });
      }
      if (_.isArray(plugins)) plugs = plugins;
      if (_.isFunction(plugins)) {
        if (!_.isPlainObject(plugins())) throw new Error
          ('Woops! Did the ship forget to return a plain object?');
        plugs.push(plugins());
      }
      return plugs;
  }
  /**
   * 'assert' asserts the plugin and makes sure that the plugin
   * is in proper fomrat.
   * @param {object} plugin - The plugin to assert.
   */
  assert(plugin) {
    debug('core', 'debug', `class: ${Plugify.name}`, `process: assert`);
    try {
      if (_.has(plugin, 'main')) throw new Error
        ('Woops! Did you forget the main function?');
      if (_.has(plugin, 'package')) throw new Error
        ('Woops! Did you forget the package?');
      if (_.has(plugin.package, 'type')) throw new Error
        ('Woops! Did you forget the "type" of plugin?');
      if (_.has(plugin.package, 'name')) throw new Error
        ('Woops! Did you forget the "name" of plugin?');
      if (!_.has(plugin.package, 'defaults')) throw new Error
        ('Woops! Did you forget to add "defaults"?');
      if (_.has(plugin, 'defaults')) throw new Error
        ('Woops! Did you forget to add the "defaults"?');
    } catch (error) { 
        debug('core', 'error', `class: ${Plugify.name}`, 
                `error: ${error.stack || error.toString()}`); 
    }
  }
}


export default (plugins, options, defaults) => {
  'use strict';
  return new Plugify(plugins, options, defaults).plugins;
};
