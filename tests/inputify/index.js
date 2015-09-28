var assert = require('chai').assert;
var __ = require('../../modules/inputify');

describe("Inputify", function() {
    
   describe("api", function() {
       
       var input = __('Hello', {greet:'hello'});
      describe("phrase()", function() {
          it('should return a string', function() {
             assert.isFunction(input.phrase);
             assert.typeOf(input.phrase(), 'string');
          });
      });
      
      describe("arguments()", function() {
         it('should return an array', function() {
            assert.isFunction(input.arguments);
            assert.typeOf(input.arguments(), 'array');
         }); 
      });
      
      describe("other()", function() {
          it('should return an object', function() {
              assert.isFunction(input.other);
              assert.typeOf(input.other(), 'object');
          });
          
          describe("values()", function() {
              it('should return an object', function(){
                  assert.isFunction(input.other().values);
                  assert.typeOf(input.other().values(), 'object');
              });
          });
          
          describe("args()", function () {
              it('should return an empty array', function(){
                 assert.isFunction(input.other().args);
                 assert.typeOf(input.other().args(), 'array');
                 assert.deepEqual(input.other().args(), []); 
              });
          });
          
          describe("hasArgs()", function() {
             it('should return a boolean', function() {
               assert.isFunction(input.other().hasArgs);
               assert.typeOf(input.other().hasArgs(), 'boolean');
               assert.strictEqual(input.other().hasArgs(), false);  
             });
          });
          describe("hasValues()", function() {
             it('should return a boolean', function() {
               assert.isFunction(input.other().hasValues);
               assert.typeOf(input.other().hasValues(), 'boolean');
               assert.strictEqual(input.other().hasValues(), true);  
             });
          });
      });
   });
   
   describe("input", function() {
       describe("__('Hello')", function() {
           var input = __('Hello');
           it('should return a phrase', function() {
               assert.strictEqual(input.phrase(), 'Hello');
           });
       });
       describe("__('Hello', ['hello', 'world'])", function() {
           var input = __('Hello', ['hello', 'world']);
           it('should return a phrase and args', function() {
              assert.strictEqual(input.phrase(), 'Hello');
              assert.deepEqual(input.other().args(), ['hello', 'world']); 
           });
       });
       
       describe("__('Hello', {greet:'hello'})", function(){
           var input = __('Hello', {greet:'hello'});
           it('should return a phrase and values', function() {
              assert.deepEqual(input.other().values(), {greet:'hello'}); 
           });
       });
   });
});