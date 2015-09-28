# gengojs-debug
The debugger console for [gengo.js](http://github.com/iwatakeshi/gengojs)

## Usage

#### ES6
```javascript
import debug from 'gengojs-debug';

debug(namespace:string, level:string, args:*);
```
#### ES5
```javascript
var debug = require('gengojs-debug');

debug(namespace:string, level:string, args:*);
```

In terminal:

```bash
# In OSX, set the namespace and the debug level then run a file:
DEBUG=gengo.core:warn, node index.js

# In Windows, set the namespace and the debug level:
DEBUG=gengo.core:warn
# Run the file
node index.js
```

## Namespaces
The available namespaces are:

* core
* parser
* router
* backend
* api
* localize
* header

## Levels

The available levels are:

* debug
* warn
* error
* info
* verbose
* silly

Note that you must prepend `'gengo'` before the namespaces
as you access the namespace with a `'.'` and then specify
the debug level after appending a `':'`.

Example:

```bash
DEBUG=gengo.parser:debug gengo.router:*
```