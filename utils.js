'use strict';

var utils = {};
utils.sections = ['thead', 'tbody', 'tfoot'];

/**
 * Create html element start tag with additional attributes of provided
 *
 * ```js
 * console.log(htmlElement('tr', ' class="active"'));
 * //=> <tr class="active">
 * ```
 * @param  {String} `name` Name of the element to create
 * @param  {String} `attr` Optional attributes to add to the tag
 * @return {String} Html element start tag
 */

utils.htmlElement = function(name, attr) {
  return `<${name}${attr ? ' ' + attr : ''}>`;
};

/**
 * Create an html table cell using the specified name (th/td)
 *
 * ```js
 * var cell = htmlCell('td');
 * console.log(cell({attr: 'class="error"', text: 'doowb'}));
 * //=> <td class="error">doowb</td>
 * ```
 * @param  {String} `name` Element name to use when creating the cell
 * @return {Function} Function that takes a column object to use to create the cell
 */

utils.htmlCell = function(name) {
  return function(col) {
    return `${utils.htmlElement(name, col.attr)}${col.text}</${name}>`;
  };
};

/**
 * Create an html table row using the specified name (th/td) for cell elements.
 *
 * ```js
 * var row = htmlRow('td');
 * console.log(row({attr: 'class="error"', cols: ['foo', 'bar', 'baz']}));
 * //=> <tr class="error">
 * //=>   <td>foo</td>
 * //=>   <td>bar</td>
 * //=>   <td>baz</td>
 * //=> </tr>
 * ```
 * @param  {String} `name` Element name to use when creating the cells
 * @return {Function} Function that takes a row object to use to create the row (useful in `.map`)
 */

utils.htmlRow = function(name) {
  return function(row) {
    var html = `    ${utils.htmlElement('tr', row.attr)}\n      `;
    html += row.cols.map(utils.htmlCell(name)).join('\n      ');
    html += '\n    </tr>';
    return html;
  };
};

/**
 * Create an html table section (thead/tbody) using the given table and name information
 *
 * @param  {Object} `table` Normalized table object
 * @param  {String} `section` Name of the section to create.
 * @param  {String} `name` Element name to use when creating cells in the section
 * @return {String} html for the section
 */

utils.htmlSection = function(table, section, name) {
  var html = `  ${utils.htmlElement(section, table[section].attr)}\n`;
  html += table[section].rows.map(utils.htmlRow(name)).join('\n');
  html += `\n  </${section}>\n`;
  return html;
};

/**
 * Normalize a table section that may contain rows and attr properties.
 *
 * ```js
 * console.log(normalizeSection(['foo', 'bar', 'baz']));
 * //=> {
 * //=>   rows: ['foo', 'bar', 'baz']
 * //=> }
 * ```
 * @param  {Object|Array} 'section' Section to normalize
 * @return {Object} normalized section object
 */

utils.normalizeSection = function(section) {
  if (Array.isArray(section)) {
    section = {rows: section.slice()};
  }

  if (section.rows && Array.isArray(section.rows)) {
    section.rows = section.rows.map(utils.normalizeRow);
  }
  return section;
};

/**
 * Normalizes an individual row into an object with attr and cols properties.
 *
 * ```js
 * var row = ['foo', 'bar', 'baz'];
 * console.log(normalizeRow(row));
 * //=> {
 * //=>   cols: ['foo', 'bar', 'baz']
 * //=> }
 * ```
 * @param  {Object|Array} `row` Row to normalize
 * @return {Object} normalized row object
 */

utils.normalizeRow = function(row) {
  if (Array.isArray(row)) {
    row = {cols: row.slice()};
  }

  if (row.cols && Array.isArray(row.cols)) {
    row.cols = row.cols.map(utils.normalizeColumn);
  }
  return row;
};

/**
 * Normalizes an individual column into an object with attr and text properties.
 * ```js
 * console.log(normalizeColumn('foo'));
 * //=> {text: 'foo'}
 * ```
 * @param  {Object|String} `col` column string or object to normalize
 * @return {Object} normalized column object
 */

utils.normalizeColumn = function(col) {
  if (typeof col === 'string') {
    return { text: col };
  }
  return col;
};

/**
 * Normalizes the sections in a table to be in a format usable by the helper
 *
 * ```js
 * var table = {
 *   attr: 'class="table"',
 *   thead: [['Foo', 'Bar', 'Baz']],
 *   tbody: [['foo', 'bar', 'baz'], ['FOO', 'BAR', 'BAZ']]
 * };
 * console.log(normalizeTable(table));
 * //=> {
 * //=>   attr: 'class="table"',
 * //=>   thead: {
 * //=>     rows: [
 * //=>       { cols: [{text: 'Foo'}, {text: 'Bar'}, {text: 'Baz'}] }
 * //=>     ]
 * //=>   },
 * //=>   tbody: {
 * //=>     rows: [
 * //=>       { cols: [{text: 'foo'}, {text: 'bar'}, {text: 'baz'}] },
 * //=>       { cols: [{text: 'FOO'}, {text: 'BAR'}, {text: 'BAZ'}] }
 * //=>     ]
 * //=>   }
 * //=> }
 * ```
 * @param  {Object} `table` Unnormalized table object
 * @return {Object} normalized table object
 */

utils.normalizeTable = function(table) {
  utils.sections.forEach(function(key) {
    if (table.hasOwnProperty(key)) {
      table[key] = utils.normalizeSection(table[key]);
    }
  });
  return table;
};

/**
 * Expose `utils` modules
 */

module.exports = utils;
