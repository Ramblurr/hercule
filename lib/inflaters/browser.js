'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = inflate;

var _stream = require('stream');

function inflate() {
  var browserStream = new _stream.Readable();

  browserStream.emit('error', new Error('Please provide a custom linkResolver for use in browser.'));
  browserStream.push(null);
  return browserStream;
}
//# sourceMappingURL=browser.js.map