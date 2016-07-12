'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = inflate;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _duplexer = require('duplexer2');

var _duplexer2 = _interopRequireDefault(_duplexer);

var _trimStream = require('../trim-stream');

var _trimStream2 = _interopRequireDefault(_trimStream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * inflate() returns a readable stream of the file excluding the terminating <newline> character of the last line.
 * This permits inline and in-paragraph transclusion as some aspects of markdown are sensitive to newlines.
 *
 * @param {string} link - Absolute path to the file to be transcluded
 * @return {object} outputStream - Readable stream object
 */
function inflate(link) {
  var trimStream = new _trimStream2.default();
  var localStream = _fs2.default.createReadStream(link, { encoding: 'utf8' });

  localStream.pipe(trimStream);

  // duplexer bubbles errors automatically for convenience
  var outputStream = (0, _duplexer2.default)({ objectMode: true }, localStream, trimStream);

  return outputStream;
}
//# sourceMappingURL=local.js.map