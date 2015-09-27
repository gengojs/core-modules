# gengojs-core-modules

[gengo.js](https://www.github.com/gengojs/gengojs) core modules 
is a set of modules that helps the [core](https://www.github.com/gengojs/core-modules) to function properly.

[![Build Status](https://travis-ci.org/gengojs/core-modules.svg)](https://travis-ci.org/gengojs/core-modules)

## Classes

### Inputify

This module returns the phrase and the extracted arguments
as an API for the parser plugin.

`@example`

```javascript
import { inputify } from 'gengojs-modules'
```


#### API

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

`@example`

```javascript
import { optify } from 'gengojs-modules'
```

#### Supported Extensions

The supported extensions are:
* `.js` (Javascript)
* `.json` (JSON)
* `.yml`, `.yaml` (YAML)

### Plugify

This module initializes the plugins.

`@example`

```javascript
import { plugify } from 'gengojs-modules'
```

### Servify

This module detects the server and applies the API to the
request and response objects

`@example`

```javascript
import { servify } from 'gengojs-modules'
```

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
