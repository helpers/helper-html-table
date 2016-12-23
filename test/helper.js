'use strict';

require('mocha');
var assert = require('assert');

var Engine = require('engine');
var handlebars = require('handlebars');
var htmlTable = require('../');

describe('helper', function() {
  describe('ejs', function() {
    var engine;
    beforeEach(function() {
      engine = new Engine();
      engine.helper('table', htmlTable);
    });

    it('should throw an error when invalid args are passed', function(cb) {
      try {
        var tmpl = '<%= table() %>';
        engine.render(tmpl);
        cb(new Error('expected an error'));
      } catch (err) {
        assert(err);
        assert.equal(err.message, 'expected first argument to be an object');
        cb();
      }
    });

    it('should render an html table from a minimal table object', function() {
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

      var actual = engine.render('<%= table(test) %>', {test: table});
      assert.equal(actual, expected);
    });

    it('should render an html table from table object with mixed information', function() {
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
      var actual = engine.render('<%= table(test) %>', {test: table});
      assert.equal(actual, expected);
    });
  });

  describe('handlebars', function() {
    var engine;
    beforeEach(function() {
      engine = handlebars.create();

      // wrapping this because handlebars always passes an object as the last argument
      engine.registerHelper('table', function(table, options) {
        var args = [].slice.apply(arguments);
        args.pop();
        return htmlTable.apply(htmlTable, args);
      });
    });

    it('should throw an error when invalid args are passed', function(cb) {
      try {
        var tmpl = '{{table}}';
        engine.compile(tmpl)();
        cb(new Error('expected an error'));
      } catch (err) {
        assert(err);
        assert.equal(err.message, 'expected first argument to be an object');
        cb();
      }
    });

    it('should render an html table from a minimal table object', function() {
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

      var actual = engine.compile('{{{table test}}}')({test: table});
      assert.equal(actual, expected);
    });

    it('should render an html table from table object with mixed information', function() {
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
      var actual = engine.compile('{{{table test}}}')({test: table});
      assert.equal(actual, expected);
    });

    it('should render internal template tags after the table is created', function() {
      engine.registerHelper('render', function(str, context, options) {
        if (typeof options === 'undefined') {
          options = context;
          context = this;
        }
        return engine.compile(str)(context);
      });

      engine.registerHelper('upper', function(str) {
        return str.toUpperCase();
      });

      var table = {
        thead: [[
          {
            attr: 'class="active"',
            text: '{{upper title}} <span class="pull-right">&darr;</span>'
          },
          'Created',
          'Last Modified'
        ]],
        tbody: [
          ['123', '2016-01-01', '2016-02-01'],
          ['456', '2016-03-01', '2016-04-01'],
          ['789', '2016-05-01', '2016-06-01']
        ]
      };

      var expected = `<table>
  <thead>
    <tr>
      <th class="active">IDENTIFIER <span class="pull-right">&darr;</span></th>
      <th>Created</th>
      <th>Last Modified</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>123</td>
      <td>2016-01-01</td>
      <td>2016-02-01</td>
    </tr>
    <tr>
      <td>456</td>
      <td>2016-03-01</td>
      <td>2016-04-01</td>
    </tr>
    <tr>
      <td>789</td>
      <td>2016-05-01</td>
      <td>2016-06-01</td>
    </tr>
  </tbody>
</table>
`;

      var tmpl = '{{{render (table test)}}}';
      var actual = engine.compile(tmpl)({test: table, title: 'identifier'});
      assert.equal(actual, expected);
    });
  });
});
