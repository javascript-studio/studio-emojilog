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
    this.str = '';
  }

  _transform(chunk, enc, callback) {
    this.str += chunk.toString();
    let p = this.str.indexOf('\n');
    while (p !== -1) {
      let row = this.str.substring(0, p);
      let match = row.match(/at (.+) \(.+:([0-9]+):([0-9]+)\)$/i);
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
      } else {
        match = row.match(/(at )?.+:([0-9]+):([0-9]+)$/i);
        if (match) {
          const pos = this.mapper.originalPositionFor({
            line: Number(match[2]),
            column: Number(match[3])
          });
          if (pos.line) {
            const prefix = row.substring(0, match.index);
            const source = pos.source;
            const name = pos.name;
            if (name) {
              row = `${prefix}at ${name} (${source}:${pos.line}:${pos.column})`;
            } else {
              row = `${prefix}at ${source}:${pos.line}:${pos.column}`;
            }
          }
        }
      }
      this.push(row);
      this.push('\n');
      this.str = this.str.substring(p + 1);
      p = this.str.indexOf('\n');
    }
    callback(null);
  }

};
