# helper-html-table [![NPM version](https://img.shields.io/npm/v/helper-html-table.svg?style=flat)](https://www.npmjs.com/package/helper-html-table) [![NPM downloads](https://img.shields.io/npm/dm/helper-html-table.svg?style=flat)](https://npmjs.org/package/helper-html-table) [![Linux Build Status](https://img.shields.io/travis/helpers/helper-html-table.svg?style=flat&label=Travis)](https://travis-ci.org/helpers/helper-html-table) [![Windows Build Status](https://img.shields.io/appveyor/ci/helpers/helper-html-table.svg?style=flat&label=AppVeyor)](https://ci.appveyor.com/project/helpers/helper-html-table)

> Create an HTML table from JSON configuration.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save helper-html-table
```

## Usage

```js
var htmlTable = require('helper-html-table');
```

### EJS

Use with an ejs style template engine like [engine](https://github.com/jonschlinkert/engine):

```js
var Engine = require('engine');
var engine = new Engine();
engine.helper('htmltable', htmlTable);

var tmpl = '<%= htmltable(table) %>';
var data = {
  table: {
    attr: 'class="table"',
    thead: [['Foo', 'Bar', 'Baz']],
    tbody: [
      ['foo', 'bar', 'baz'],
      ['FOO', 'BAR', 'BAZ']
    ]
  }
}
var html = engine.render(tmpl, data);
console.log(html);
```

```html
<table class="table">
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
```

### Handlebars

Use with [handlebars](http://www.handlebarsjs.com/):

```js
var Handlebars = require('handlebars');
handlebars.registerHelper('htmltable', htmlTable);

var tmpl = '{{htmltable table}}';
var data = {
  table: {
    attr: 'class="table"',
    thead: [['Foo', 'Bar', 'Baz']],
    tbody: [
      ['foo', 'bar', 'baz'],
      ['FOO', 'BAR', 'BAZ']
    ]
  }
}
var compiled = handlebars.compile(tmpl);
var html = compiled(data);
console.log(html);
```

```html
<table class="table">
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
```

## API

**Example**

```js
var table = {
  // attributes to add to the <table> tag
  attr: 'class="table"',

  // thead rows (each row has an array of columns)
  thead: [['Foo', 'Bar', 'Baz']],

  // tbody rows (each row has an array of columns)
  tbody: [
    ['foo', 'bar', 'baz'],
    ['FOO', 'BAR', 'BAZ']
  ]
};

var html = htmlTable(table);
console.log(html);
//=> <table class="table">
//=>   <thead>
//=>     <tr>
//=>       <td>Foo</td>
//=>       <td>Bar</td>
//=>       <td>Baz</td>
//=>     </tr>
//=>   </thead>
//=>   <tbody>
//=>     <tr>
//=>       <td>foo</td>
//=>       <td>bar</td>
//=>       <td>baz</td>
//=>     </tr>
//=>     <tr>
//=>       <td>FOO</td>
//=>       <td>BAR</td>
//=>       <td>BAZ</td>
//=>     </tr>
//=>   </tbody>
//=> </table>
```

**Params**

* `table` **{Object}**: object containing properties describing the rows and columns in a table head and body. See [formats](#formats) for additional options.
* `returns` **{String}**: HTML table generated from configuration object.

## Formats

The table object passed in may be in the following formats. These will all be normalized to the most expanded format before generating the table.

The table object may have the following root level properties:

* `attr`: basic [attr](#attr) string that will be added to the `<table>` tag.
* `thead`: [section object](#sections) that contains table head rows and columns
* `tbody`: [section object](#sections) that contains the main table body rows and columns
* `tfoot`: [section object](#sections) that contains table foot rows and columns

### Attr

When a `attr` property is on the main table object, [section objects](#sections), [row objects](#rows), or [column objects](#columns), the string will be included in the opening tag for the related html element. This allows customization of any attribute on the html element.

```js
{
  // adds class="table" to the <table> tag
  attr: 'class="table"',
  thead: { ... },
  tbody: { ... }
}
```

```html
<table class="table">
  <thead>...</thead>
  <tbody>...</tbody>
</table>
```

### Sections

Section objects may be a simple array of [row objects](#rows) or a complex object with an [attr](#attr) property and a [rows](#rows) property.

**simple array**

```js
[
  ['row1', 'foo', 'bar', 'baz'],
  ['row2', 'foo', 'bar', 'baz'],
  ['row3', 'foo', 'bar', 'baz'],
  ['row4', 'foo', 'bar', 'baz']
]
```

**complex object**

```js
{
  attr: 'class="error"',
  rows: [
    ['row1', 'foo', 'bar', 'baz'],
    ['row2', 'foo', 'bar', 'baz'],
    ['row3', 'foo', 'bar', 'baz'],
    ['row4', 'foo', 'bar', 'baz']
  ]  
}
```

### Rows

Rows contain row objects that may be a simple array of [column objects](#columns) or complex objects with an [attr](#attr) proprety and a [cols](#columns) property. Rows are on [section objects](#sections).

**simple array**

```js
{
  // rows property may be on section objects
  rows: [
    // each item in the row is a column
    ['foo', 'bar', 'baz'],
    ['FOO', 'BAR', 'BAZ']
  ]
}
```

**complex object**

```js
{
  // rows property may be on section objects
  rows: [
    {cols: ['foo', 'bar', 'baz']},
    {attr: 'class="alternate"', cols: ['FOO', 'BAR', 'BAZ']}
  ]
}
```

### Columns

Columns contain column objects that may be a simple string or a complex object with an [attr](#attr) property and a text property. Columns are on [row objects](#rows).

**simple string**

```js
{
  // cols property may be on row objects
  cols: ['foo', 'bar', 'baz']
}
```

**complex object**

```js
{
  // cols property may be on row objects
  cols: [
    {attr: 'align="right"', text: 'foo'},
    {attr: 'align="center"', text: 'bar'},
    {attr: 'align="left"', text: 'baz'}
  ]
}
```

### Collapsed

A collapsed table object may represent each section as an array of arrays for rows and columns:

```js
var table = {
  // 1 row of 4 columns
  thead: [['ID', 'Foo', 'Bar', 'Baz']],
  // 3 rows of 4 columns
  tbody: [
    ['row-1', 'foo', 'bar', 'baz'],
    ['row-2', 'foo', 'bar', 'baz'],
    ['row-3', 'foo', 'bar', 'baz'],
  ]
};
```

Expands into:

```js
var table = {
  // 1 row of 4 columns
  thead: {
    rows: [
      {cols: [{text: 'ID'}, {text: 'Foo'}, {text: 'Bar'}, {text: 'Baz'}]}
    ]
  },
  // 3 rows of 4 columns
  tbody: {
    rows: [
      {cols: [{text: 'row-1'}, {text: 'foo'}, {text: 'bar'}, {text: 'baz'}]},
      {cols: [{text: 'row-2'}, {text: 'foo'}, {text: 'bar'}, {text: 'baz'}]},
      {cols: [{text: 'row-3'}, {text: 'foo'}, {text: 'bar'}, {text: 'baz'}]},
    ]
  }
};
```

### Expanded

The most expanded format of a table object may have `attr` properties on any object and may include the `thead`, `tbody`, and `tfoot` sections:

```js
var table = {
  attr: 'class="table"',
  thead: {
    attr: 'class="foo"',
    rows: [
      {
        attr: 'class="bar"',
        cols: [
          {attr: 'class="primary"', text: 'ID'},
          {attr: 'class="sortable"', text: 'Foo'},
          {attr: 'class="disabled"', text: 'Bar'},
          {attr: 'class="filterable"', text: 'Baz'}
        ]
      }
    ]
  },
  tbody: {
    attr: 'class="baz"',
    rows: [
      {
        attr: 'class="row-first row-odd"',
        cols: [{text: 'row-1'}, {text: 'foo'}, {text: 'bar'}, {text: 'baz'}]
      },
      {
        attr: 'class="row-even"',
        cols: [{text: 'row-1'}, {text: 'foo'}, {text: 'bar'}, {text: 'baz'}]
      },
      {
        attr: 'class="row-odd row-selected"',
        cols: [{text: 'row-1'}, {text: 'foo'}, {text: 'bar'}, {text: 'baz'}]
      },
      {
        attr: 'class="row-event error"',
        cols: [{text: 'row-1'}, {text: 'foo'}, {text: 'bar'}, {text: 'baz'}]
      },
    ]
  },
  tfoot: {
    attr: 'class="qux"',
    rows: [
      {
        attr: 'class="info"',
        cols: [
          {attr: 'class="summary"', text: 'Summary'},
          {attr: 'class="number"', text: '1'},
          {attr: 'class="number"', text: '2'},
          {attr: 'class="number"', text: '3'}
        ]
      }
    ]
  }
};
```

This will generate the following table html:

```html
<table class="table">
  <thead class="foo">
    <tr class="bar">
      <th class="primary">ID</th>
      <th class="sortable">Foo</th>
      <th class="disabled">Bar</th>
      <th class="filterable">Baz</th>
    </tr>
  </thead>
  <tbody class="baz">
    <tr class="row-first row-odd">
      <td>row-1</td>
      <td>foo</td>
      <td>bar</td>
      <td>baz</td>
    </tr>
    <tr class="row-even">
      <td>row-1</td>
      <td>foo</td>
      <td>bar</td>
      <td>baz</td>
    </tr>
    <tr class="row-odd row-selected">
      <td>row-1</td>
      <td>foo</td>
      <td>bar</td>
      <td>baz</td>
    </tr>
    <tr class="row-event error">
      <td>row-1</td>
      <td>foo</td>
      <td>bar</td>
      <td>baz</td>
    </tr>
  </tbody>
  <tfoot class="qux">
    <tr class="info">
      <td class="summary">Summary</td>
      <td class="number">1</td>
      <td class="number">2</td>
      <td class="number">3</td>
    </tr>
  </tfoot>
</table>
```

## About

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

Please read the [contributing guide](contributing.md) for avice on opening issues, pull requests, and coding standards.

### Building docs

_(This document was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme) (a [verb](https://github.com/verbose/verb) generator), please don't edit the readme directly. Any changes to the readme must be made in [.verb.md](.verb.md).)_

To generate the readme and API documentation with [verb](https://github.com/verbose/verb):

```sh
$ npm install -g verb verb-generate-readme && verb
```

### Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

### Author

**Brian Woodward**

* [github/doowb](https://github.com/doowb)
* [twitter/doowb](http://twitter.com/doowb)

### License

Copyright © 2016, [Brian Woodward](https://github.com/doowb).
Released under the [MIT license](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.2.0, on December 22, 2016._