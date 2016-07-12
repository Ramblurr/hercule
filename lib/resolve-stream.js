'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ResolveStream;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _duplexer = require('duplexer2');

var _duplexer2 = _interopRequireDefault(_duplexer);

var _regexpStreamTokenizer = require('regexp-stream-tokenizer');

var _regexpStreamTokenizer2 = _interopRequireDefault(_regexpStreamTokenizer);

var _resolve = require('./resolve');

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
* Input stream: object
* - link (string, required)
* - relativePath (string, required)
* - parents (array, required)
* - references (array, required)
*
* Output stream: object
* - chunk (string, required)
*
* Input and output properties can be altered by providing options
*/

function ResolveStream(source, opt) {
  var options = _lodash2.default.merge({}, opt);

  // Create nested duplex stream
  // TODO: rename this function for improved clarity
  function inflate(link, relativePath, references, parents, indent) {
    var resolverStream = new ResolveStream(link, options);

    function token(match) {
      return _lodash2.default.merge((0, _config.defaultToken)(match, options, indent), {
        source: link,
        relativePath: relativePath,
        references: [].concat(_toConsumableArray(references)),
        parents: [link].concat(_toConsumableArray(parents))
      });
    }

    function separator(match) {
      return (0, _config.defaultSeparator)(match, { indent: indent, source: link });
    }

    var tokenizerOptions = { leaveBehind: '' + _config.WHITESPACE_GROUP, token: token, separator: separator };
    var linkRegExp = _lodash2.default.get(options, 'linkRegExp') || _config.defaultTokenRegExp;
    var tokenizerStream = (0, _regexpStreamTokenizer2.default)(tokenizerOptions, linkRegExp);

    tokenizerStream.pipe(resolverStream);

    return (0, _duplexer2.default)({ objectMode: true }, tokenizerStream, resolverStream);
  }

  /* eslint-disable consistent-return */
  function transform(chunk, encoding, cb) {
    var _this = this;

    var transclusionLink = _lodash2.default.get(chunk, 'link');
    var relativePath = _lodash2.default.get(chunk, 'relativePath') || '';
    var parentRefs = _lodash2.default.get(chunk, 'references') || [];
    var parents = _lodash2.default.get(chunk, 'parents') || [];
    var indent = _lodash2.default.get(chunk, 'indent') || '';
    var self = this;

    function handleError(message, path, error) {
      self.push(chunk);
      if (!_lodash2.default.isUndefined(message)) self.emit('error', { message: message, path: path, error: error });
      return cb();
    }

    if (!transclusionLink) return handleError();

    //  Sourcemap
    var cursor = {
      line: _lodash2.default.get(chunk, 'line'),
      column: _lodash2.default.get(chunk, 'column') + chunk.content.indexOf(transclusionLink)
    };

    // Parses raw transclusion link: primary.link || fallback.link reference.placeholder:reference.link ...
    (0, _resolve.parseTransclude)(transclusionLink, relativePath, source, cursor, function (parseErr, primary, fallback, parsedReferences) {
      if (parseErr) return handleError('Link could not be parsed', transclusionLink, parseErr);

      var references = _lodash2.default.uniq([].concat(_toConsumableArray(parsedReferences), _toConsumableArray(parentRefs)));

      // References from parent files override primary links, then to fallback if provided and no matching references
      var link = (0, _resolve.resolveReferences)(primary, fallback, parentRefs);

      // NEW: support for custom resolve link function
      var linkResolver = _lodash2.default.isFunction(options.resolveLink) ? options.resolveLink : _resolve.resolveLink;

      // Resolve link to readable stream
      linkResolver(link, function (resolveErr, input, resolvedLink, resolvedRelativePath) {
        if (resolveErr) return handleError('Link could not be inflated', resolvedLink, resolveErr);
        if (_lodash2.default.includes(parents, resolvedLink)) return handleError('Circular dependency detected', resolvedLink);

        var inflater = inflate(resolvedLink, resolvedRelativePath, references, parents, indent);

        input.on('error', function (inputErr) {
          _this.emit('error', inputErr);
          cb();
        });

        inflater.on('readable', function inputReadable() {
          var content = void 0;
          while ((content = this.read()) !== null) {
            self.push(content);
          }
        });

        inflater.on('error', function (inflateErr) {
          _this.emit('error', inflateErr);
          cb();
        });

        inflater.on('end', function () {
          return cb();
        });

        input.pipe(inflater);
      });
    });
  }

  return _through2.default.obj(transform);
}
//# sourceMappingURL=resolve-stream.js.map