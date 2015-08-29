# gengojs-core-modules

gengo.js core modules is a set of modules that helps the core to function properly.

[![Build Status](https://travis-ci.org/iwatakeshi/gengojs-core-modules.svg)](https://travis-ci.org/iwatakeshi/gengojs-core-modules)

## Classes

### Inputify

This module returns the phrase and the extracted arguments
as an API for the parser plugin.

#### API

`@example`

```javascript
import { inputify } from 'gengojs-modules'
```

##### `phrase()`

`@return {string}` The phrase to internationalize.

`@example`

```javascript
let input = inputify(phrase, args);
var phrase = input.phrase();
```
##### `arguments()`

`@return {Array}` The original arguments before extraction.

`@example`

```javascript
let input = inputify(phrase, args);
var arguments = input.args();
```
##### `other()`

`@return {object}` The other arguments after extraction in the form of
an API.

`@example`

```javascript
let input = inputify(phrase, args);
let other = input.other();
var args = other.args();
var values = other.values();
```
### Optify

This module reads or sets the initial options.

#### Supported Extensions

The supported extensions are:
* `.js` (Javascript)
* `.json` (JSON)
* `.yml`, `.yaml` (YAML)

### Plugify

This module initializes the plugins.

### Servify

This module detects the server and applies the API to the
request and response objects

## Develop

```bash
# Build modules with gulp for development
gulp
```

## Test

```bash
# Build modules with gulp for production
gulp test
```