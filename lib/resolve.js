'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveReferences = resolveReferences;
exports.parseTransclude = parseTransclude;
exports.resolveLink = resolveLink;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _string = require('./inflaters/string');

var _string2 = _interopRequireDefault(_string);

var _local = require('./inflaters/local');

var _local2 = _interopRequireDefault(_local);

var _http = require('./inflaters/http');

var _http2 = _interopRequireDefault(_http);

var _grammar = require('./grammar');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function resolveReferences(primary, fallback, references) {
  var override = _lodash2.default.find(references, { placeholder: primary.link });
  return override || fallback || primary;
}

function parseTransclude(transclusionLink, relativePath, source, _ref, cb) {
  var line = _ref.line;
  var column = _ref.column;

  var parsedLink = void 0;
  var fallback = void 0;

  try {
    parsedLink = _grammar.transcludeGrammar.parse(transclusionLink);
  } catch (ex) {
    return cb(ex);
  }

  var parsedPrimary = parsedLink.primary;
  var parsedFallback = parsedLink.fallback;

  var primary = { link: parsedPrimary.match, relativePath: relativePath, source: source, line: line, column: column + parsedPrimary.index };

  if (parsedFallback) {
    fallback = { link: parsedFallback.match, relativePath: relativePath, source: source, line: line, column: column + parsedFallback.index };
  }

  var parsedReferences = _lodash2.default.map(parsedLink.references, function (_ref2) {
    var placeholder = _ref2.placeholder;
    var link = _ref2.link;
    return { placeholder: placeholder, link: link.match, relativePath: relativePath, source: source, line: line, column: column + link.index };
  });

  return cb(null, primary, fallback, parsedReferences);
}

// FIXME: link.link is stupid!
/**
 * resolveLink() Resolves a link to a readable stream for transclusion.
 *
 * @param {Object} link - Link will be resolved and contents returned as a readable stream
 * @param {string} link.link - Path to the target file relative to the from the source of the link
 * @param {string} link.relativePath - Directory name of the source file where the link originated.
 *   The relative path is not derived from the source to isolate path handling to this function.
 * @param {string} link.source - Absolute path of the source file
 * @param {number} link.line - Location of the of the link in the source file
 * @param {number} link.column - Location of the of the link in the source file
 * @param {resolveLinkCallback} cb - callback
 * @returns {function} cb
 */
function resolveLink(_ref3, cb) {
  var link = _ref3.link;
  var relativePath = _ref3.relativePath;
  var source = _ref3.source;
  var line = _ref3.line;
  var column = _ref3.column;

  var input = '';
  var linkType = void 0;
  var resolvedLink = void 0;
  var resolvedRelativePath = void 0;

  try {
    linkType = _grammar.linkGrammar.parse(link);
  } catch (err) {
    return cb({ err: err, message: 'Link could not be parsed', path: link });
  }

  if (linkType === 'string') {
    input = (0, _string2.default)(link, source, line, column);
  }

  if (linkType === 'local') {
    resolvedLink = _path2.default.join(relativePath, link);
    resolvedRelativePath = _path2.default.dirname(resolvedLink);
    input = (0, _local2.default)(resolvedLink);
  }
  if (linkType === 'http') {
    resolvedLink = link;
    resolvedRelativePath = link;
    input = (0, _http2.default)(resolvedLink);
  }

  return cb(null, input, resolvedLink, resolvedRelativePath);
}

/**
 * Resolved link callback
 *
 * @callback resolveLinkCallback
 * @param {Object} error - Error object
 * @param {Object} input - Readable stream object which will be processed for transculsion
 * @param {string} absolutePath - Absolute path of the link permits checking for circular dependencies
 * @param {string} dirname - Directory name of the path to the file or equivalent permits handling of relative links
 */
//# sourceMappingURL=resolve.js.map