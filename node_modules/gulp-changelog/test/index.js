var expect = require('expect.js'),
  gulp = require('gulp'),
  through = require('through2'),
  mocha = require('mocha'),
  plugin = require('../lib/');

describe('module', function () {
  it('exports gulp plugin', function () {
    expect(plugin).to.be.a('function');
  });
});

describe('plugin', function () {
  it('returns transform stream', function (done) {
   plugin('gengojs').then(function (stream) {
      expect(stream).to.be.an('object');
      expect(stream._transform).to.be.a('function');
      stream.on('data', function (chunk) {
        expect(chunk).to.not.be.empty();
      })
      .on('end', function () {
          done();
      })
      .emit('data', 'test');
      stream.end();
    });
  });
});