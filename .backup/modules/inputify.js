/**
 * This module extracts the phrase and arguments.
 */
import debug from 'gengojs-debug';
import _ from 'lodash';
import Extractify from './extractify';

/**
 * This class extends the Extractify class
 * by adding an API wrapper around it.
 * @class
 */
class Inputify extends Extractify {
  constructor(phrase, args) {
      super(phrase, args);
      debug('core', 'debug', `class: ${Inputify.name}`, `process: constructor`);
      debug('core', 'info', `class: ${Inputify.name}`,
        `\n\textract: ${JSON.stringify(this.extracts)}`,
        `\n\tphrase: ${this.phrase()}`,
        `\n\targs: ${JSON.stringify(this.arguments())}`);
    }
    /**
     * Returns the extracted phrase.
     * @return {string} - The phrase to internationalize.
     */
  phrase() {
      debug('core', 'debug', `class: ${Inputify.name}`, `process: phrase`);
      return this.extracts.phrase;
    }
    /**
     * Returns the extracted arguments.
     * @return {Array} - The extracted arguments
     */
  arguments() {
      debug('core', 'debug', `class: ${Inputify.name}`, `process: arguments`);
      return this.extracts.args;
    }
    /**
     * Returns the extracted values.
     * @return {Object} - The extracted values (plain object)
     */
  values() {
    debug('core', 'debug', `class: ${Inputify.name}`, `process: values`);
    return this.extracts.values;
  }
  
  /**
   * Determines whether the arguments are empty.
   * @return {boolean} True if the object is empty 
   */
  hasArgs() {
    debug('core', 'debug', `class: ${Inputify.name}`, `process: hasArgs`);
    return !_.isEmpty(this.extracts.args);
  }
  /**
   * Determines whether the values are empty.
   * @return {boolean} True if the object is empty 
   */
  hasValues() {
    debug('core', 'debug', `class: ${Inputify.name}`, `process: hasValues`);
    return !_.isEmpty(this.extracts.values);
  }
  
}

export default (phrase, ...args) => {
  'use strict';
  return new Inputify(phrase, args);
};