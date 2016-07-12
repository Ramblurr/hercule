'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _dashdash = require('dashdash');

var _dashdash2 = _interopRequireDefault(_dashdash);

var _transcludeStream = require('./transclude-stream');

var _transcludeStream2 = _interopRequireDefault(_transcludeStream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* Hercule
* A simple markdown transclusion tool
* Author: James Ramsay
*/

var opts = void 0;
var args = void 0;

var parser = _dashdash2.default.createParser({
  options: [{
    names: ['help', 'h'],
    type: 'bool',
    help: 'Print this help and exit.'
  }, {
    names: ['output', 'o'],
    type: 'string',
    help: 'File to output.',
    helpArg: 'FILE'
  },
  // TODO: unit test transcludeStringSync with relativePath
  {
    names: ['relativePath', 'r'],
    type: 'string',
    help: 'Relative path. stdin will be parsed relative to this path.'
  }, {
    names: ['sourcemap', 's'],
    type: 'bool',
    help: 'Generate sourcemap for output file.'
  }, {
    name: 'reporter',
    type: 'string',
    help: 'Supported reporters include json, json-stderr, tree'
  }]
});

try {
  opts = parser.parse(process.argv);
  args = opts._args; // eslint-disable-line
} catch (err) {
  process.stderr.write('hercule: error: ' + err.message + '\n');
  process.exit(1);
}

if (opts.help) {
  process.stdout.write('usage: hercule [OPTIONS] path/to/input.md\n\n');
  process.stdout.write('options:\n' + parser.help({ includeEnv: true }).trimRight() + '\n\n');
  process.exit();
}

function main() {
  var inputStream = void 0;
  var outputStream = void 0;
  var source = void 0;
  var options = {
    parents: [],
    parentRefs: []
  };

  if (args.length === 0) {
    // Reading input from stdin
    inputStream = process.stdin;
    source = opts.relativePath + '/stdin.md';
    options.relativePath = opts.relativePath;
  } else {
    // Reading input from file
    source = _path2.default.normalize(args[0]);
    inputStream = _fs2.default.createReadStream(source, { encoding: 'utf8' });
  }

  if (opts.output) {
    // Writing output to file
    outputStream = _fs2.default.createWriteStream(opts.output, { encoding: 'utf8' });
    options.outputFile = opts.output;
  } else {
    // Writing output to stdout
    outputStream = process.stdout;
    options.outputFile = 'stdout';
  }

  var transclude = new _transcludeStream2.default(source, options);

  transclude.on('error', function (err) {
    if (opts.reporter === 'json-err') {
      process.stderr.write(JSON.stringify(err));
    } else {
      process.stderr.write('\n\nERROR: ' + err.message + ' (' + err.path + ')\n');
    }
    process.exit(1);
  });

  transclude.on('sourcemap', function (srcMap) {
    if (opts.output) _fs2.default.writeFileSync(opts.output + '.map', JSON.stringify(srcMap) + '\n');
  });

  inputStream.pipe(transclude).pipe(outputStream);
}

main();
//# sourceMappingURL=main.js.map