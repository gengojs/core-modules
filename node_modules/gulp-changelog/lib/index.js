'use strict';

var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var File = gutil.File;
var changelog = require('changelog');
var Q = require('q');
var file = require('gulp-file');
/**
 * changelog
 * @param {object|string} source - The package.json file or package name
 * @param {object} options - The options to set the plugin.
 */
module.exports = function (source, options) {
  if(!source) throw new PluginError('gulp-changelog', 'A package or name is required!')
  var deferred = Q.defer();
  var filename = 'CHANGELOG', num = 15;
  if(options) {
    filename = options.filename ? options.filename : filename;
    num = options.number ? options.number : num;
  }
  if(typeof source === 'string') source = {name:source};
  changelog.generate(source.name, num)
    .then(function() {
      var markdown = changelog.markdown.apply(this, arguments);
        markdown = file(filename + '.md', markdown, {src:true});
        deferred.resolve(markdown);
    });
  return deferred.promise;
};