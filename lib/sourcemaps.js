/*
 * Copyright (c) Maximilian Antoni <max@javascript.studio>
 *
 * @license MIT
 */
'use strict';

const fs = require('fs');
const source_map = require('source-map');
const Transform = require('stream').Transform;

module.exports = class extends Transform {

  constructor(file) {
    super();
    // eslint-disable-next-line no-sync
    const map = fs.readFileSync(file, 'utf8');
    this.mapper = new source_map.SourceMapConsumer(map);
  }

  _transform(chunk, enc, callback) {
    let str = chunk.toString();
    let p = str.indexOf('\n');
    while (p !== -1) {
      let row = str.substring(0, p);
      const match = row.match(/at (.+) \(.+:([0-9]+):([0-9]+)\)/i);
      if (match) {
        const pos = this.mapper.originalPositionFor({
          line: Number(match[2]),
          column: Number(match[3])
        });
        if (pos.line) {
          const prefix = row.substring(0, match.index);
          const name = pos.name || match[1];
          const source = pos.source;
          row = `${prefix}at ${name} (${source}:${pos.line}:${pos.column})`;
        }
      }
      this.push(row);
      this.push('\n');
      str = str.substring(p + 1);
      p = str.indexOf('\n');
    }
    callback(null, str);
  }

};
