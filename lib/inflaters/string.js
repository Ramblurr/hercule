'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = inflate;

var _stream = require('stream');

/**
 * inflate() returns a readable stream, which will provide exactly one object.
 * String transclusion is trigered by strings inside the transclusion link, and cannot contain links themselves.
 *
 * Examples:
 *   :[fallback example](foo.md || "bar")
 *   :[reference example](foo.md bar:"bar")
 *
 * @param {string} input - Quoted string which will be inserted into the generated output
 * @param {string} source - Source document containing the input string
 * @param {number} line - Location of the of input in the source file
 * @param {number} column - Location of the of input in the source file
 * @return {Object} stringStream - Readable stream object
 */
function inflate(input, source, line, column) {
  var stringStream = new _stream.Readable({ objectMode: true });

  // Strings provided by fallback or reference are quoted
  var content = input.slice(1, -1);
  var adjustedColumn = column + 1; // compensate for removed leading quote

  stringStream.push({ content: content, source: source, line: line, column: adjustedColumn });
  stringStream.push(null);
  return stringStream;
}
//# sourceMappingURL=string.js.map