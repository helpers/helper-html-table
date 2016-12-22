'use strict';

require('mocha');
var assert = require('assert');
var utils = require('../utils');

describe('utils', function() {
  describe('normalize', function() {
    it('should normalize a column from a string', function() {
      assert.deepEqual(utils.normalizeColumn('foo'), {text: 'foo'});
    });

    it('should normalize a column from an object', function() {
      var col = {attr: 'class="error"', text: 'foo'};
      assert.deepEqual(utils.normalizeColumn(col), col);
    });

    it('should normalize a row from an array of column strings', function() {
      var expected = {
        cols: [{text: 'foo'}, {text: 'bar'}, {text: 'baz'}]
      }
      assert.deepEqual(utils.normalizeRow(['foo', 'bar', 'baz']), expected);
    });

    it('should normalize a row from an array of mixed column types', function() {
      var expected = {
        cols: [{text: 'foo'}, {text: 'bar'}, {text: 'baz'}]
      }
      assert.deepEqual(utils.normalizeRow(['foo', {text: 'bar'}, 'baz']), expected);
    });

    it('should normalize a row from an object with an array of column strings', function() {
      var row = {attr: 'class="error"', cols: ['foo', 'bar', 'baz']};
      var expected = {
        attr: 'class="error"',
        cols: [{text: 'foo'}, {text: 'bar'}, {text: 'baz'}]
      }
      assert.deepEqual(utils.normalizeRow(row), expected);
    });

    it('should normalize a row from an object with an array of mixed column types', function() {
      var row = {attr: 'class="error"', cols: ['foo', { text: 'bar'}, 'baz']};
      var expected = {
        attr: 'class="error"',
        cols: [{text: 'foo'}, {text: 'bar'}, {text: 'baz'}]
      }
      assert.deepEqual(utils.normalizeRow(row), expected);
    });

    it('should normalize a section from an array of rows', function() {
      var expected = {
        rows: [
          {cols: [{text: 'foo'}, {text: 'bar'}, {text: 'baz'}]}
        ]
      };
      assert.deepEqual(utils.normalizeSection([['foo', 'bar', 'baz']]), expected);
    });

    it('should normalize a section from an array of rows with mixed column types', function() {
      var expected = {
        rows: [
          {cols: [{text: 'foo'}, {text: 'bar'}, {text: 'baz'}]}
        ]
      };
      assert.deepEqual(utils.normalizeSection([['foo', {text: 'bar'}, 'baz']]), expected);
    });

    it('should normalize a section from an object with an array of rows with column strings', function() {
      var row = {attr: 'class="error"', rows: [{cols: ['foo', 'bar', 'baz']}]};
      var expected = {
        attr: 'class="error"',
        rows: [
          {cols: [{text: 'foo'}, {text: 'bar'}, {text: 'baz'}]}
        ]
      };
      assert.deepEqual(utils.normalizeSection(row), expected);
    });

    it('should normalize a section from an object with an array of rows with mixed column types', function() {
      var row = {attr: 'class="error"', rows: [{cols: ['foo', { text: 'bar'}, 'baz']}]};
      var expected = {
        attr: 'class="error"',
        rows: [
          {cols: [{text: 'foo'}, {text: 'bar'}, {text: 'baz'}]}
        ]
      }
      assert.deepEqual(utils.normalizeSection(row), expected);
    });

    it('should normalize a table from a minimal object', function() {
      var table = {
        thead: [['Foo', 'Bar', 'Baz']],
        tbody: [['foo', 'bar', 'baz'], ['FOO', 'BAR', 'BAZ']]
      };

      var expected = {
        thead: {
          rows: [
            {cols: [{text: 'Foo'}, {text: 'Bar'}, {text: 'Baz'}]}
          ]
        },
        tbody: {
          rows: [
            {cols: [{text: 'foo'}, {text: 'bar'}, {text: 'baz'}]},
            {cols: [{text: 'FOO'}, {text: 'BAR'}, {text: 'BAZ'}]}
          ]
        }
      };
      assert.deepEqual(utils.normalizeTable(table), expected);
    });

    it('should normalize a table from an object with mixed information', function() {
      var table = {
        thead: {attr: 'class="dim"', rows: [['Foo', {attr: 'class="filterable"', text: 'Bar'}, 'Baz']]},
        tbody: [['foo', 'bar', 'baz'], {attr: 'class="error"', cols: ['FOO', 'BAR', {attr: 'class="info"', text: 'BAZ'}]}]
      };

      var expected = {
        thead: {
          attr: 'class="dim"',
          rows: [
            {cols: [{text: 'Foo'}, {attr: 'class="filterable"', text: 'Bar'}, {text: 'Baz'}]}
          ]
        },
        tbody: {
          rows: [
            {cols: [{text: 'foo'}, {text: 'bar'}, {text: 'baz'}]},
            {
              attr: 'class="error"',
              cols: [{text: 'FOO'}, {text: 'BAR'}, {attr: 'class="info"', text: 'BAZ'}]
            }
          ]
        }
      };
      assert.deepEqual(utils.normalizeTable(table), expected);
    });
  });
});
