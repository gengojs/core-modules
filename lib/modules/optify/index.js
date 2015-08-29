/**
 * This module reads or sets the initial options
 */
import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import debug from 'gengojs-debug';
/*
    Definition: Options must be either a string or a plain object.

    1. Options must be an object that specifies the type 
       such as 'parser' or options must be a string that specifies 
       the path to the options file.
       

    Side note: Every plugin created must offer default options and must 
    be responsible with letting the developers know about the options
    for your plugin (through GitHub, etc).
*/
class Optify {
  constructor(options) {
   debug('core', 'debug', `class: ${Optify.name}`, `process: constructor`);
    this.options = {};
    var settings;
    try {
      if (_.isPlainObject(options) && !_.isEmpty(options))
      this.options = options;
      else if (_.isString(options)) {
        // Normalize the string and if it ends in yml replace it
        options = path.normalize(options.replace('yml', 'yaml'));
        // Load the json or javascript file
        if (/\.json/.test(options) || /\.js/.test(options)) {
          settings = require(options);
          this.options = settings;
        } else if (/\.yaml/.test(options)) {
          // Load yaml
          settings = yaml.safeLoad(fs.readFileSync(options, 'utf8'));
          this.options = settings;
        } else {
          throw new Error
          ('Oops! Did you forgt to add the extension? \n' +
            'The supported extensions are .json, .js, and .yaml.')
        }
      } else this.options = settings || {};
    } catch (error) { 
      debug('core', 'error', `class: ${Optify.name}`, 
        `error: ${error.stack || error.toString()}`); 
    }
  }
}

export
default (options) => {
  'use strict';
  return new Optify(options).options;
};