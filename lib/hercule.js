'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TranscludeStream = exports.resolveLink = undefined;

var _resolve = require('./resolve');

Object.defineProperty(exports, 'resolveLink', {
  enumerable: true,
  get: function get() {
    return _resolve.resolveLink;
  }
});
exports.transcludeString = transcludeString;
exports.transcludeFile = transcludeFile;
exports.transcludeFileSync = transcludeFileSync;
exports.transcludeStringSync = transcludeStringSync;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _transcludeStream = require('./transclude-stream');

var _transcludeStream2 = _interopRequireDefault(_transcludeStream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SYNC_TIMEOUT = 10000;

var TranscludeStream = exports.TranscludeStream = _transcludeStream2.default;

function transcludeString() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var input = args.shift();
  var cb = args.pop();
  var _args$ = args[0];
  var options = _args$ === undefined ? {} : _args$;

  var relativePath = _lodash2.default.get(options, 'relativePath');
  var source = relativePath ? options.relativePath + '/string' : 'string';

  var transclude = new _transcludeStream2.default(source, options);
  var outputString = '';
  var sourceMap = void 0;
  var cbErr = null;

  transclude.on('readable', function read() {
    var content = null;
    while ((content = this.read()) !== null) {
      outputString += content.toString('utf8');
    }
  }).on('error', function (err) {
    if (!cbErr) cbErr = err;
  }).on('sourcemap', function (srcmap) {
    return sourceMap = srcmap;
  }).on('end', function () {
    return cb(cbErr, outputString, sourceMap.sources, sourceMap);
  });

  transclude.write(input, 'utf8');
  transclude.end();
}

function transcludeFile() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  var input = args.shift();
  var cb = args.pop();
  var _args$2 = args[0];
  var options = _args$2 === undefined ? {} : _args$2;

  if (!_lodash2.default.get(options, 'relativePath')) options.relativePath = _path2.default.dirname(input);

  var transclude = new _transcludeStream2.default(input, options);
  var inputStream = _fs2.default.createReadStream(input, { encoding: 'utf8' });
  var outputString = '';
  var sourceMap = void 0;
  var cbErr = null;

  inputStream.on('error', function (err) {
    return cb(err);
  });

  transclude.on('readable', function read() {
    var content = null;
    while ((content = this.read()) !== null) {
      outputString += content;
    }
  }).on('error', function (err) {
    if (!cbErr) cbErr = err;
  }).on('sourcemap', function (srcmap) {
    return sourceMap = srcmap;
  }).on('end', function () {
    return cb(cbErr, outputString, sourceMap.sources, sourceMap);
  });

  inputStream.pipe(transclude);
}

function transcludeFileSync(input, options) {
  var syncOptions = { cwd: __dirname, timeout: SYNC_TIMEOUT };
  var syncArgs = [input, '--reporter', 'json-err'];

  _lodash2.default.forEach(options, function (optionValue, optionName) {
    syncArgs.push('--' + optionName, '' + optionValue);
  });

  var result = _child_process2.default.spawnSync('../bin/hercule', syncArgs, syncOptions);
  var outputContent = result.stdout.toString();
  var err = result.stderr.toString();

  if (err) throw new Error('Could not transclude file');

  return outputContent;
}

function transcludeStringSync(input, options) {
  var syncOptions = { input: input, cwd: __dirname, timeout: SYNC_TIMEOUT };
  var syncArgs = ['--reporter', 'json-err'];

  _lodash2.default.forEach(options, function (optionValue, optionName) {
    syncArgs.push('--' + optionName, '' + optionValue);
  });

  var result = _child_process2.default.spawnSync('../bin/hercule', syncArgs, syncOptions);
  var outputContent = result.stdout.toString();
  var err = result.stderr.toString();

  if (err) throw new Error('Could not transclude input');

  return outputContent;
}
//# sourceMappingURL=hercule.js.map