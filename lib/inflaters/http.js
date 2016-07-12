'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = inflate;

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _duplexer = require('duplexer2');

var _duplexer2 = _interopRequireDefault(_duplexer);

var _trimStream = require('../trim-stream');

var _trimStream2 = _interopRequireDefault(_trimStream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * inflate() returns a readable stream of the file excluding the terminating <newline> character of the last line.
 * This permits inline and in-paragraph transclusion as some aspects of markdown are sensitive to newlines.
 *
 * @param {string} link - HTTP path to the file to be transcluded
 * @return {Object} outputStream - Readable stream object
 */
function inflate(link) {
  var trimStream = new _trimStream2.default();
  var remoteStream = _request2.default.get(link);

  // Manually trigger error since 2XX respsonse doesn't trigger error despite not having expected content
  remoteStream.on('response', function error(res) {
    if (res.statusCode !== 200) this.emit('error', { message: 'Could not read file', path: link });
  });

  remoteStream.pipe(trimStream);

  // duplexer bubbles errors automatically for convenience
  var outputStream = (0, _duplexer2.default)({ objectMode: true }, remoteStream, trimStream);

  return outputStream;
}
//# sourceMappingURL=http.js.map