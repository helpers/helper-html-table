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
      };
      assert.deepEqual(utils.normalizeRow(['foo', 'bar', 'baz']), expected);
    });

    it('should normalize a row from an array of mixed column types', function() {
      var expected = {
        cols: [{text: 'foo'}, {text: 'bar'}, {text: 'baz'}]
      };
      assert.deepEqual(utils.normalizeRow(['foo', {text: 'bar'}, 'baz']), expected);
    });

    it('should normalize a row from an object with an array of column strings', function() {
      var row = {attr: 'class="error"', cols: ['foo', 'bar', 'baz']};
      var expected = {
        attr: 'class="error"',
        cols: [{text: 'foo'}, {text: 'bar'}, {text: 'baz'}]
      };
      assert.deepEqual(utils.normalizeRow(row), expected);
    });

    it('should normalize a row from an object with an array of mixed column types', function() {
      var row = {attr: 'class="error"', cols: ['foo', { text: 'bar'}, 'baz']};
      var expected = {
        attr: 'class="error"',
        cols: [{text: 'foo'}, {text: 'bar'}, {text: 'baz'}]
      };
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
      };
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

  describe('html', function() {
    it('should create an html element start tag with the specified name', function() {
      assert.equal(utils.htmlElement('td'), '<td>');
    });

    it('should create an html element start tag with the specified name and attributes', function() {
      assert.equal(utils.htmlElement('td', 'class="error"'), '<td class="error">');
    });

    it('should create an html table cell with the specified name', function() {
      assert.equal(utils.htmlCell('td')({text: 'foo'}), '<td>foo</td>');
    });

    it('should create an html table cell with the specified name and attributes', function() {
      assert.equal(utils.htmlCell('td')({text: 'foo', attr: 'class="error"'}), '<td class="error">foo</td>');
    });

    it('should create an html table row with the specified name', function() {
      var row = {
        cols: [{text: 'foo'}, {text: 'bar'}, {text: 'baz'}]
      };
      assert.equal(utils.htmlRow('td')(row), '    <tr>\n      <td>foo</td>\n      <td>bar</td>\n      <td>baz</td>\n    </tr>');
    });

    it('should create an html table row with the specified name and attributes', function() {
      var row = {
        attr: 'class="error"',
        cols: [{text: 'foo'}, {attr: 'class="info"', text: 'bar'}, {text: 'baz'}]
      };
      assert.equal(utils.htmlRow('td')(row), '    <tr class="error">\n      <td>foo</td>\n      <td class="info">bar</td>\n      <td>baz</td>\n    </tr>');
    });

    it('should create an html table section with the specified name', function() {
      var table = utils.normalizeTable({thead: [['foo', 'bar', 'baz']]});
      var expected = `  <thead>
    <tr>
      <th>foo</th>
      <th>bar</th>
      <th>baz</th>
    </tr>
  </thead>
`;
      assert.equal(utils.htmlSection(table, 'thead', 'th'), expected);
    });

    it('should create an html table section with the specified name and attributes', function() {
      var table = utils.normalizeTable({
        tbody: {
          attr: 'class="qux"',
          rows: [
            ['foo', 'bar', 'baz'],
            {
              attr: 'class="error"',
              cols: ['foo', {attr: 'class="info"', text: 'bar'}, 'baz']
            }
          ]
        }
      });
      var expected = `  <tbody class="qux">
    <tr>
      <td>foo</td>
      <td>bar</td>
      <td>baz</td>
    </tr>
    <tr class="error">
      <td>foo</td>
      <td class="info">bar</td>
      <td>baz</td>
    </tr>
  </tbody>
`;
      assert.equal(utils.htmlSection(table, 'tbody', 'td'), expected);
    });
  });
});
