/** global describe, it */
var assert = require('chai').assert;
var optify = require('../../modules/optify');
var root = require('app-root-path');
var fixtures = root + '/tests/optify/fixtures/';

describe("Optify", function() {
   describe("JS", function() {
       var options = optify(fixtures + 'options.js');
       it("should return the test options from path", function(){
           assert.isObject(options);
           assert.deepEqual(options, {greet:true});
       });
       
       options = optify({greet:true});
       it("should return the test options from object", function() {
           assert.isObject(options);
           assert.deepEqual(options, {greet:true});
       });
   });
   
   describe("JSON", function() {
        var options = optify(fixtures + 'options.js');
       it("should return the test options from path", function(){
           assert.isObject(options);
           assert.deepEqual(options, {greet:true});
       });
   });
   
   describe("YAML", function() {
        var options = optify(fixtures + 'options.js');
       it("should return the test options from path", function(){
           assert.isObject(options);
           assert.deepEqual(options, {greet:true});
       });
   });
});