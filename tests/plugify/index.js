var assert = require('chai').assert;
var plugify = require('../../modules/plugify');
var path = require('path');
var fixtures = path.resolve(__dirname, '../plugify/fixtures/');
var plugs = require(fixtures);

describe("Plugify", function() {
   describe("plugins", function() {
       var plugins = plugify(plugs());
       it("should return the correct plugins", function(){
           assert.isFunction(plugs);
           assert.isObject(plugins);
           assert.notDeepEqual(plugins, {
            parser: [],
            router: [],
            backend: [],
            api: [],
            header: [],
            localize: []
           });
       });
   });
});