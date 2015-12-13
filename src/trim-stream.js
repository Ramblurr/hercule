import through2 from 'through2';

/**
* Trims new line at EOF to allow a file to be transcluded inline.
* Multiple transclusions immediately before the end of file can also
* result excessive new lines accumulating.
*
* Input stream: (string)
*
* Output stream: (string)
*/

module.exports = function TrimStream() {
  let inputBuffer = '';

  function transform(chunk, encoding, cb) {
    const input = chunk.toString('utf8');
    let output;

    // Combine buffer and new input
    inputBuffer = inputBuffer.concat(input);

    // Return everything but the last character
    output = inputBuffer.slice(0, -1);
    inputBuffer = inputBuffer.slice(-1);

    cb();
    this.push(output);
  }


  function flush(cb) {
    // Empty internal buffer and signal the end of the output stream.
    if (inputBuffer !== '') {
      inputBuffer = inputBuffer.replace(/\n$/, '');
      this.push(inputBuffer);
    }

    this.push(null);
    cb();
  }

  return through2.obj(transform, flush);
};
