'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LINK_GROUP = exports.PLACEHOLDER_GROUP = exports.WHITESPACE_GROUP = exports.MATCH_GROUP = exports.defaultTokenRegExp = undefined;
exports.defaultToken = defaultToken;
exports.defaultSeparator = defaultSeparator;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Link detection (including leading whitespace)
var defaultTokenRegExp = exports.defaultTokenRegExp = new RegExp(/(^[\t ]*)?(:\[.*?\]\((.*?)\))/gm);
var MATCH_GROUP = exports.MATCH_GROUP = 0;
var WHITESPACE_GROUP = exports.WHITESPACE_GROUP = 1;
var PLACEHOLDER_GROUP = exports.PLACEHOLDER_GROUP = 2;
var LINK_GROUP = exports.LINK_GROUP = 3;

function defaultToken(match, _ref, whitespace) {
  var linkMatch = _ref.linkMatch;
  var _ref$relativePath = _ref.relativePath;
  var relativePath = _ref$relativePath === undefined ? '' : _ref$relativePath;
  var _ref$references = _ref.references;
  var references = _ref$references === undefined ? [] : _ref$references;
  var _ref$parents = _ref.parents;
  var parents = _ref$parents === undefined ? [] : _ref$parents;
  var _ref$source = _ref.source;
  var source = _ref$source === undefined ? '' : _ref$source;

  return {
    content: match[MATCH_GROUP],
    link: _lodash2.default.isFunction(linkMatch) ? linkMatch(match) : match[LINK_GROUP],
    indent: _lodash2.default.filter([whitespace, match[WHITESPACE_GROUP]], _lodash2.default.isString).join(''),
    relativePath: relativePath,
    references: references,
    parents: parents,
    source: source
  };
}

function defaultSeparator(match, _ref2) {
  var _ref2$indent = _ref2.indent;
  var indent = _ref2$indent === undefined ? '' : _ref2$indent;
  var _ref2$source = _ref2.source;
  var source = _ref2$source === undefined ? '' : _ref2$source;

  return {
    indent: indent,
    content: match[MATCH_GROUP],
    source: source
  };
}
//# sourceMappingURL=config.js.map