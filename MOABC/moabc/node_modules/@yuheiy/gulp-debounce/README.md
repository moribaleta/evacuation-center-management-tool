# gulp-debounce

Call a debounced function when stream flows.

## Install

```sh
npm i -D @yuheiy/gulp-debounce
```

## Usage

```javascript
const gulp = require('gulp')
const pug = require('gulp-pug')
const debounce = require('gulp-debounce')
const browserSync = require('browser-sync').create()

gulp.task('html', () =>
  gulp.src('src/**/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('dist'))
    .pipe(debounce(browserSync.reload, 300))
)
```

## API

### `debounce(func, [wait=0])`

Creates and sets a debounced function.

## License

MIT
