'use strict';

var utils = require('./utils');

/**
 * Create an html table from a JSON object.
 *
 * ```js
 * var table = {
 *   // attributes to add to the <table> tag
 *   attr: 'class="table"',
 *
 *   // thead rows (each row has an array of columns)
 *   thead: [['Foo', 'Bar', 'Baz']],
 *
 *   // tbody rows (each row has an array of columns)
 *   tbody: [
 *     ['foo', 'bar', 'baz'],
 *     ['FOO', 'BAR', 'BAZ']
 *   ]
 * };
 *
 * var html = htmlTable(table);
 * console.log(html);
 * //=> <table class="table">
 * //=>   <thead>
 * //=>     <tr>
 * //=>       <td>Foo</td>
 * //=>       <td>Bar</td>
 * //=>       <td>Baz</td>
 * //=>     </tr>
 * //=>   </thead>
 * //=>   <tbody>
 * //=>     <tr>
 * //=>       <td>foo</td>
 * //=>       <td>bar</td>
 * //=>       <td>baz</td>
 * //=>     </tr>
 * //=>     <tr>
 * //=>       <td>FOO</td>
 * //=>       <td>BAR</td>
 * //=>       <td>BAZ</td>
 * //=>     </tr>
 * //=>   </tbody>
 * //=> </table>
 * ```
 * @param  {Object} `table` object containing properties describing the rows and columns in a table head and body. See [formats](#formats) for additional options.
 * @return {String} HTML table generated from configuration object.
 * @api public
 */

module.exports = function(table) {
  if (typeof table === 'undefined') {
    throw new Error('expected first argument to be an object');
  }

  table = utils.normalizeTable(table);
  var html = utils.htmlElement('table', table.attr) + '\n';

  utils.sections.forEach(function(section) {
    if (table.hasOwnProperty(section)) {
      html += utils.htmlSection(table, section, section === 'thead' ? 'th' : 'td');
    }
  });

  html += '</table>\n';
  return html;
};

