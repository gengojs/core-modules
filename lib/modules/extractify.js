import _ from 'lodash';
import debug from 'gengojs-debug';
/**
 * This class extracts the input and seperates the arguments
 * into phrase, args, and values.
 * @class
 */
class Extractify {
  constructor(phrase, array) {
    debug('core', 'debug', `class: ${Extractify.name}`, `process: constructor`);
    var values = {},
      args = [],
      value, length = array ? array.length : 0;
    debug('core', 'debug',
      `class: ${Extractify.name}`,
      `array: ${JSON.stringify(array)}`,
      `length: ${length}`);
    // If the arguments is greater than 2 (because of offset)
    if (length > 1) {
      // Just append them to the array
      array.forEach(item => args.push(item));
    }
    // If they are exactly 2 arguments
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
    if (_.isPlainObject(phrase) && !_.isEmpty(values)) {
      if (_.has(phrase, 'locale')) values.locale = phrase.locale;
      if (_.has(phrase, 'phrase')) phrase = phrase.phrase;
    }
    this.extracts = {
      phrase, values, args
    };
  }
}

export default Extractify;