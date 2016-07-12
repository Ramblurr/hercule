'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Transcluder;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _duplexer = require('duplexer2');

var _duplexer2 = _interopRequireDefault(_duplexer);

var _through2Get = require('through2-get');

var _through2Get2 = _interopRequireDefault(_through2Get);

var _regexpStreamTokenizer = require('regexp-stream-tokenizer');

var _regexpStreamTokenizer2 = _interopRequireDefault(_regexpStreamTokenizer);

var _resolveStream = require('./resolve-stream');

var _resolveStream2 = _interopRequireDefault(_resolveStream);

var _indentStream = require('./indent-stream');

var _indentStream2 = _interopRequireDefault(_indentStream);

var _sourceMapStream = require('./source-map-stream');

var _sourceMapStream2 = _interopRequireDefault(_sourceMapStream);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* Input stream: string
*
* Output stream: string
*/

var DEFAULT_OPTIONS = {
  input: 'link',
  output: 'content',
  source: 'string'
};

// The sourceFile should be relative to the sourcePath
function Transcluder() {
  var source = arguments.length <= 0 || arguments[0] === undefined ? 'local' : arguments[0];
  var opt = arguments[1];

  var options = _lodash2.default.merge({}, DEFAULT_OPTIONS, { relativePath: _path2.default.dirname(source) }, opt);

  // Sourcemap
  var outputFile = _lodash2.default.get(options, 'outputFile');
  var sourceMap = void 0;

  function token(match) {
    return (0, _config.defaultToken)(match, options);
  }

  function separator(match) {
    return (0, _config.defaultSeparator)(match, options);
  }

  var linkRegExp = _lodash2.default.get(options, 'linkRegExp') || _config.defaultTokenRegExp;
  var tokenizerOptions = {
    leaveBehind: '' + _config.WHITESPACE_GROUP,
    token: token,
    separator: separator
  };
  var resolverOptions = {
    linkRegExp: options.linkRegExp,
    linkMatch: options.linkMatch,
    resolveLink: options.resolveLink
  };

  var tokenizer = (0, _regexpStreamTokenizer2.default)(tokenizerOptions, linkRegExp);
  var resolver = new _resolveStream2.default(source, resolverOptions);
  var indenter = new _indentStream2.default();
  var sourcemap = new _sourceMapStream2.default(outputFile);
  var stringify = (0, _through2Get2.default)('content');

  tokenizer.pipe(resolver).pipe(indenter).pipe(sourcemap).pipe(stringify);

  var transcluder = (0, _duplexer2.default)(tokenizer, stringify);

  resolver.on('error', function (err) {
    transcluder.emit('error', err);
    resolver.end();
  });

  sourcemap.on('sourcemap', function (generatedSourceMap) {
    sourceMap = generatedSourceMap;
  });

  transcluder.on('end', function () {
    transcluder.emit('sources', sourceMap.sources);
    transcluder.emit('sourcemap', sourceMap);
  });

  return transcluder;
}
//# sourceMappingURL=transclude-stream.js.map