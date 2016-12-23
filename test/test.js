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

  it('should return an html table from a minimal table object', function() {
    var table = {
      thead: [['Foo', 'Bar', 'Baz']],
      tbody: [['foo', 'bar', 'baz'], ['FOO', 'BAR', 'BAZ']]
    };
    var expected = `<table>
  <thead>
    <tr>
      <th>Foo</th>
      <th>Bar</th>
      <th>Baz</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>foo</td>
      <td>bar</td>
      <td>baz</td>
    </tr>
    <tr>
      <td>FOO</td>
      <td>BAR</td>
      <td>BAZ</td>
    </tr>
  </tbody>
</table>
`;
    assert.equal(htmlTable(table), expected);
  });

  it('should return an html table from table object with mixed information', function() {
    var table = {
      thead: {attr: 'class="dim"', rows: [['Foo', {attr: 'class="filterable"', text: 'Bar'}, 'Baz']]},
      tbody: [['foo', 'bar', 'baz'], {attr: 'class="error"', cols: ['FOO', 'BAR', {attr: 'class="info"', text: 'BAZ'}]}]
    };
    var expected = `<table>
  <thead class="dim">
    <tr>
      <th>Foo</th>
      <th class="filterable">Bar</th>
      <th>Baz</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>foo</td>
      <td>bar</td>
      <td>baz</td>
    </tr>
    <tr class="error">
      <td>FOO</td>
      <td>BAR</td>
      <td class="info">BAZ</td>
    </tr>
  </tbody>
</table>
`;
    assert.equal(htmlTable(table), expected);
  });
});
