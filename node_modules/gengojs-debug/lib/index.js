import debug from 'debug';
import { install as map } from 'source-map-support';
/**
 * Debug is a debug wrapper for gengo.js
 */
class Debug {
	constructor (namespace, level, args) {
		map();
		this.namespace = namespace;
		this.level = level;
		this.args = args;
		this.debug = (()=>{
			var obj = {};
			var gengo = 'gengo';
			var namespaces = ['core','parser', 'router', 
				'backend', 'api', 'localize', 'header'];
			var levels = ['debug', 'warn', 'error', 'info', 'verbose', 'silly'];
			namespaces.forEach(function(namespace) {
				levels.forEach(function(level) {
					var key = gengo + '.' + namespace + ':' + level;
					obj[key] = debug(gengo + '.' + namespace + ':' + level);
				}, this);
			}, this);
			return obj;
		})();
	}
  log () {	
	  this.debug['gengo' + '.' + this.namespace.toLowerCase() + ':' + 
		this.level.toLowerCase()].apply(null, this.args);
  }
}

/**
 * Wraps 'debug' and outputs the arguments using namespaces.
 * @param {string} namespace - The namespace of the gengo to debug.
 * @param {string} level - The level of debug to output.
 * @param {*} args - The arguments to output.
 * @example 
 *  debugify('core.plugins', 'warn', 'Hello world')
 */
export default (namespace, level, ...args) => {
	(new Debug(namespace, level, args)).log();
};