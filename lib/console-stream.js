/*
 * Copyright (c) Maximilian Antoni <max@javascript.studio>
 *
 * @license MIT
 */
'use strict';

const Writable = require('stream').Writable;

module.exports = new Writable({
  write(row) {
    const str = String(row);
    if (str) {
      console.log(str);
    }
  }
});
