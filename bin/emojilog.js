#!/usr/bin/env node
/*
 * Copyright (c) Maximilian Antoni <max@javascript.studio>
 *
 * @license MIT
 */
'use strict';

const argv = require('minimist')(process.argv.slice(2), {
  string: ['format', 'map'],
  boolean: ['ts', 'ns', 'topic', 'data'],
  alias: {
    format: ['f']
  },
  default: {
    format: 'fancy',
    ts: true,
    ns: true,
    topic: true,
    data: true,
    stack: 'peek'
  }
});

const Parser = require('@studio/ndjson/parse');
const Format = require(`@studio/log-format/${argv.format}`);

process.stdin.setEncoding('utf8');

if (argv.format === 'console') {

  process.stdin
    .pipe(new Parser({ loose_out: require('../lib/console-stream') }))
    .pipe(new Format({ trim: false }));

} else {

  let out = process.stdout;
  if (argv.map) {
    const SourceMaps = require('../lib/sourcemaps');
    out = new SourceMaps(argv.map);
    out.pipe(process.stdout);
  }

  process.stdin
    .pipe(new Parser({ loose_out: out }))
    .pipe(new Format(argv))
    .pipe(out);

}
