'use strict';

var utils = require('./utils');

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

