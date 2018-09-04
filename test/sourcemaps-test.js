/*eslint-env mocha*/
/*eslint-disable no-sync*/
'use strict';

const fs = require('fs');
const { Transform } = require('stream');
const { assert, sinon } = require('@sinonjs/referee-sinon');
const uglify = require('uglify-es');
const SourceMaps = require('../lib/sourcemaps');

describe('sourcemaps', () => {
  let output;
  let out;

  beforeEach(() => {
    output = '';
    out = new Transform({
      transform: (chunk, enc, callback) => {
        output += chunk;
        callback(null, chunk);
      }
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('maps sources', (done) => {
    const script = `function test() {
      unknown()
    }
    test()`;
    const result = uglify.minify(script, {
      sourceMap: { filename: 'test.js' }
    });
    sinon.replace(fs, 'readFileSync',
      sinon.fake.returns(JSON.stringify(result.map)));

    const stream = new SourceMaps('source.js.map');
    stream.pipe(out);

    out.on('finish', () => {
      assert.calledOnce(fs.readFileSync);
      assert.calledWith(fs.readFileSync, 'source.js.map', 'utf8');
      assert.equals(output, 'at unknown (0:2:6)\n');
      done();
    });

    stream.write('at xyz (any.js:1:17)\n');
    stream.end();
  });

  function sourceMapsForScript(script) {
    const result = uglify.minify(script, {
      sourceMap: { filename: 'test.js' }
    });

    sinon.replace(fs, 'readFileSync',
      sinon.fake.returns(JSON.stringify(result.map)));

    const stream = new SourceMaps('source.js.map');
    stream.pipe(out);
    return stream;
  }

  it('does not change row if no match', (done) => {
    const stream = sourceMapsForScript(`function test() {
      unknown()
    }
    test()`);

    out.on('finish', () => {
      assert.equals(output, 'at xyz (any.js:5:17)\n');
      done();
    });

    stream.write('at xyz (any.js:5:17)\n');
    stream.end();
  });

  it('works when receiving smaller chunks', (done) => {
    const stream = sourceMapsForScript(`function test() {
      unknown()
    }
    test()`);

    out.on('finish', () => {
      assert.equals(output, 'at unknown (0:2:6)\n');
      done();
    });

    stream.write('at xyz ');
    stream.end('(any.js:1:17)\n');
  });

  it('maps line without name', (done) => {
    const stream = sourceMapsForScript(`function test() {
      throw new Error()
    }
    test()`);

    out.on('finish', () => {
      assert.equals(output, 'at 0:2:6\n');
      done();
    });

    stream.end('at any.js:1:17\n');
  });

  it('maps line without name, but with mapped name', (done) => {
    const stream = sourceMapsForScript(`function test() {
      unknown()
    }
    test()`);

    out.on('finish', () => {
      assert.equals(output, 'at unknown (0:2:6)\n');
      done();
    });

    stream.end('at any.js:1:17\n');
  });

});
