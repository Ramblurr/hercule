'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var linkGrammar = void 0;
var transcludeGrammar = void 0;

try {
  linkGrammar = require('./inflate-link'); // eslint-disable-line
  transcludeGrammar = require('./transclusion-link'); // eslint-disable-line
} catch (ex) {
  // Permits using compiling grammar when using ES2015 source
  var peg = require('pegjs'); // eslint-disable-line
  linkGrammar = peg.buildParser(_fs2.default.readFileSync(_path2.default.join(__dirname, 'inflate-link.pegjs'), 'utf8'));
  transcludeGrammar = peg.buildParser(_fs2.default.readFileSync(_path2.default.join(__dirname, 'transclusion-link.pegjs'), 'utf8'));
}

module.exports = {
  linkGrammar: linkGrammar,
  transcludeGrammar: transcludeGrammar
};
//# sourceMappingURL=index.js.map