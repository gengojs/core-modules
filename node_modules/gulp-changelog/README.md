# gulp-changelog
[Dylang's changelog](https://github.com/dylang/changelog) for gulp.

[![Build Status](https://travis-ci.org/iwatakeshi/gulp-changelog.svg)](https://travis-ci.org/iwatakeshi/gulp-changelog)

## Usage

```
npm install gulp-changelog
```

## API

### fn(source, options)

```javascript
/**
 * Creates a changelog as a markdown file by retrieving the source.
 * @param {object|string} source - The package.json file or package name
 * @param {object} options - The options to set the plugin.
 */
```

## Example

```javascript
var gulp = require('gulp'),
	changelog = require('gulp-changelog');

gulp.task('changelog', function(cb){
  changelog(require('./package.json')).then(function(stream) {
    stream.pipe(gulp.dest('./')).on('end',cb);
  });
});
```

## Options

```javascript
{
	// The integer or semver, optional Number of versions, 
	// or the semver version to show
	'number': 15,
	// The file name of the changelog
	'filename': 'CHANGELOG'
}
```