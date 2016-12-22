'use strict';

require('mocha');
var assert = require('assert');
var htmlTable = require('../');

describe('helper-html-table', function() {
  it('should export a function', function() {
    assert.equal(typeof htmlTable, 'function');
  });

  it('should throw an error when invalid args are passed', function(cb) {
    try {
      htmlTable();
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected first argument to be an object');
      cb();
    }
  });

});
