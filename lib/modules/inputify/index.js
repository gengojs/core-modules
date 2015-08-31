/**
 * This module extracts the phrase and arguments.
 */
import debug from 'gengojs-debug';
import _ from 'lodash';
/**
 * Extractify
 */
class Extractify {
  constructor(phrase, array) {
    debug('core', 'debug', `class: ${Extractify.name}`, `process: constructor`);
    var values = {}, args = [], value, length = array ? array.length : 0;
    debug('core', 'debug', 
      `class: ${Extractify.name}`,
      `array: ${JSON.stringify(array)}`, 
      `length: ${length}`);
    // If the arguments is greater than 2 (because of offset)
    if (length > 1) {
      // Just append them to the array
      array.forEach(item => args.push(item));
    }
    // If they are exactly 2 argument
    else if (length === 1) {
      // Get the first value
      value = array[0];
      // Set arguments [...]
      if (_.isArray(value)) args = value;
      else if (_.isPlainObject(value)) args = [];
      else args.push(value);
      // Set values {...}
      values = _.isPlainObject(value) ? value : {};
    }
    // If called like __({phrase:'hello', locale:'en'})
    if(_.isPlainObject(phrase) && !_.isEmpty(values)) {
      if(_.has(phrase, 'locale')) values.locale = phrase.locale;
      if(_.has(phrase, 'phrase')) phrase = phrase.phrase;
    }
    this.phrase = phrase;
    this.values = values;
    this.args = args;
  }
  hasValues() {
    debug('core', 'debug', `class: ${Extractify.name}`, `process: hasValues`);
    return !_.isEmpty(this.values);
  }
  hasArgs() {
    debug('core', 'debug', `class: ${Extractify.name}`, `process: hasArgs`);
    return !_.isEmpty(this.args);
  }
}
/**
 * Inputify
 */
class Inputify {
  constructor(phrase, args){
    debug('core', 'debug', `class: ${Inputify.name}`, `process: constructor`);
    this._extract = new Extractify(phrase, args);
    this._phrase = this._extract.phrase;
    this._args = args;
    debug('core', 'info', `class: ${Inputify.name}`, 
      `\n\textract: ${JSON.stringify(this._extract)}`,
      `\n\tphrase: ${this._phrase}`,
      `\n\targs: ${JSON.stringify(this._args)}`);
  }
  /**
   * phrase
   * @return {string} - The phrase to internationalize.
   */
  phrase() {
    debug('core', 'debug', `class: ${Inputify.name}`, `process: phrase`);
    return this._phrase;
  }
  /**
   * arguments
   * @return {Array} - The original arguments before extraction.
   */
  arguments() {
    debug('core', 'debug', `class: ${Inputify.name}`, `process: arguments`);
    return this._args;
  }
  /**
   * other
   * @return {object} - The other arguments after extraction in
   * the form of an API.
   * @example
   * new Inputify(phrase, args).other().arguments();
   * new Inputify(phrase, args).other().values();
   * new Inputify(phrase, args).other().hasArgs();
   * new Inputfiy(phrase, args).other().hasValues();
   */
  other () {
    debug('core', 'debug', `class: ${Inputify.name}`, `process: other`);
    let args = () => { return this._extract.args; };
    let values = () => { return this._extract.values; };
    let hasArgs = () => { return this._extract.hasArgs(); };
    let hasValues = () => { return this._extract.hasValues(); };
    return { args, values, hasArgs, hasValues };
  }
}

export default (phrase, ...args) => {
  'use strict';
  return new Inputify(phrase, args);
};