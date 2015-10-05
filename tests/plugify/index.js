var assert = require('chai').assert;
var plugify = require('../../src/modules/plugify');
var path = require('path');
var fixtures = path.resolve(__dirname, '../plugify/fixtures/');
var plugs = require(fixtures);

describe("Plugify", function () {
  describe("plugins", function () {
    var plugins = plugify(plugs());
    it("should return the correct plugins", function () {
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
  describe("options", function () {
    var options = {
      parser: {
        shout: 'hello',
      },
      router: {
        shout2: 'hello'
      },
      backend: {
        shout2: 'hello'
      },
      api: {
        shout2: 'hello'
      },
      header: {
        shout2: 'hello'
      },
      localize: {
        shout2: 'hello'
      }
    };
    var plugins = plugify(plugs(), options);
    it("should merge user settings", function () {
      assert.deepEqual(options, {
        parser: {
          shout: 'hello',
          greet :'hello',
        },
        router: {
          shout2: 'hello',
          greet2 :'hello',
        },
        backend: {
          shout2: 'hello',
          greet3 :'hello',
        },
        api: {
          shout2: 'hello',
          greet4 :'hello',
        },
        header: {
          shout2: 'hello',
          greet5 :'hello',
        },
        localize: {
          shout2: 'hello',
          greet6 :'hello',
        }
      });
    });
  });
});