'use strict'

var through = require('through2')
var debounce = require('lodash.debounce')

module.exports = function(func, wait) {
  var debouncedFunc = debounce(func, wait)

  return through.obj(function(chunk, enc, cb) {
    debouncedFunc()
    cb(null, chunk)
  })
}
