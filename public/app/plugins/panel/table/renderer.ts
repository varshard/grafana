///<reference path="../../../headers/common.d.ts" />

import _ from 'lodash';
import moment from 'moment';
import kbn from 'app/core/utils/kbn';
import $ from 'jquery';
import JSONFormatter from 'json-formatter-js';

interface FormatJSONResult {
  success: boolean;
  value: string;
}

export class TableRenderer {
  formatters: any[];
  colorState: any;

  constructor(private panel, private table, private isUtc, private sanitize) {
    this.initColumns();
  }

  setTable(table) {
    this.table = table;

    this.initColumns();
  }

  initColumns() {
    this.formatters = [];
    this.colorState = {};

    for (let colIndex = 0; colIndex < this.table.columns.length; colIndex++) {
      let column = this.table.columns[colIndex];
      column.title = column.text;

      for (let i = 0; i < this.panel.styles.length; i++) {
        let style = this.panel.styles[i];

        var regex = kbn.stringToJsRegex(style.pattern);
        if (column.text.match(regex)) {
          column.style = style;

          if (style.alias) {
            column.title = column.text.replace(regex, style.alias);
          }

          break;
        }
      }

      this.formatters[colIndex] = this.createColumnFormatter(column);
    }
  }

  getColorForValue(value, style) {
    if (!style.thresholds) { return null; }

    for (var i = style.thresholds.length; i > 0; i--) {
      if (value >= style.thresholds[i - 1]) {
        return style.colors[i];
      }
    }
    return _.first(style.colors);
  }

  defaultCellFormatter(v, style) {
    if (v === null || v === void 0 || v === undefined) {
      return '';
    }

    if (_.isArray(v)) {
      v = v.join(', ');
    }

    if (style && style.sanitize) {
      return this.sanitize(v);
    } else {
      return _.escape(v);
    }
  }

  createColumnFormatter(column) {
    if (!column.style) {
      return this.defaultCellFormatter;
    }

    if (column.style.type === 'hidden') {
      return v => {
        return undefined;
      };
    }

    if (column.style.type === 'date') {
      return v => {
        if (v === undefined || v === null) {
          return '-';
        }

        if (_.isArray(v)) { v = v[0]; }
        var date = moment(v);
        if (this.isUtc) {
          date = date.utc();
        }
        return date.format(column.style.dateFormat);
      };
    }

    if (column.style.type === 'number') {
      let valueFormatter = kbn.valueFormats[column.unit || column.style.unit];

      return v =>  {
        if (v === null || v === void 0) {
          return '-';
        }

        if (_.isString(v)) {
          return this.defaultCellFormatter(v, column.style);
        }

        if (column.style.colorMode) {
          this.colorState[column.style.colorMode] = this.getColorForValue(v, column.style);
        }

        return valueFormatter(v, column.style.decimals, null);
      };
    }

    return (value) => {
      return this.defaultCellFormatter(value, column.style);
    };
  }

  formatColumnValue(colIndex, value) {
    return this.formatters[colIndex] ? this.formatters[colIndex](value) : value;
  }

  getMatchedStyle(colIndex: number) {
    for (let i = 0; i < this.panel.styles.length; i++) {
      let style = this.panel.styles[i];
      let column = this.table.columns[colIndex];
      var regex = kbn.stringToJsRegex(style.pattern);
      if (column.text.match(regex)) {
        return style;
      }
    }
  }

  renderCell(columnIndex, value, addWidthHack = false) {
    value = this.formatColumnValue(columnIndex, value);
    var style = '';
    if (this.colorState.cell) {
      style = ' style="background-color:' + this.colorState.cell + ';color: white"';
      this.colorState.cell = null;
    } else if (this.colorState.value) {
      style = ' style="color:' + this.colorState.value + '"';
      this.colorState.value = null;
    }

    // because of the fixed table headers css only solution
    // there is an issue if header cell is wider the cell
    // this hack adds header content to cell (not visible)
    var widthHack = '';
    if (addWidthHack) {
      widthHack = '<div class="table-panel-width-hack">' + this.table.columns[columnIndex].title + '</div>';
    }

    if (value === undefined) {
      style = ' style="display:none;"';
      this.table.columns[columnIndex].hidden = true;
    } else {
      this.table.columns[columnIndex].hidden = false;
    }

    function formatCellValue(value: string): any {
      const cell = $('<td' + style + '></td>');

      function isJSON(value: string): boolean {
        try {
          JSON.parse(_.unescape(value));
          return true;
        } catch (e) {
          return false;
        }
      }

      function toggleView(button, showedView, hiddenView) {
          $('.switcher').removeClass('active focus');
          button.addClass('active focus');

          showedView.show();
          hiddenView.hide();
        }

      // To prevent a number from being stringified
      if (isJSON(value) && isNaN(Number.parseFloat(value))) {
        const json = JSON.parse(_.unescape(value));
        const jsonTree = $('<div class="json-view"></div>')
          .append(new JSONFormatter(json, 1, {
            theme: 'dark'
          }).render());
        const jsonText = $('<pre class="text-view" style="display: none;">' + JSON.stringify(json, null, '  ') + '</pre>');
        const jsonViewer = $('<div class="json-viewer"></div>');
        const viewSwitcherWrapper = $('<div class="json-view-switcher"></div>');
        const textSwitcher = $('<button class="switcher text-switcher btn btn-inverse btn-mini">Text</button>');
        const jsonSwitcher = $('<button class="switcher json-switcher btn btn-inverse btn-mini active focus">JSON</button>')
          .click(function() {
            toggleView($(this), jsonTree, jsonText);
          });
        textSwitcher.click(function() {
          toggleView($(this), jsonText, jsonTree);
        });

        viewSwitcherWrapper.append(jsonSwitcher, textSwitcher);
        jsonViewer
          .append(viewSwitcherWrapper)
          .append(jsonTree)
          .append(jsonText);
        return cell.append(jsonViewer);
      } else {
        return cell.html(value + widthHack);
      }
    }
    return formatCellValue(value);
  }

  render(page) {
    let pageSize = this.panel.pageSize || 100;
    let startPos = page * pageSize;
    let endPos = Math.min(startPos + pageSize, this.table.rows.length);
    var html = [];

    for (var y = startPos; y < endPos; y++) {
      let row = this.table.rows[y];
      let cellHtml = [];
      let rowStyle = '';
      for (var i = 0; i < this.table.columns.length; i++) {
        cellHtml.push(this.renderCell(i, row[i], y === startPos));
      }

      if (this.colorState.row) {
        rowStyle = ' style="background-color:' + this.colorState.row + ';color: white"';
        this.colorState.row = null;
      }

      let htmlRow = $('<tr ' + rowStyle + '></tr>');
      htmlRow.append(cellHtml);
      html.push(htmlRow);
    }

    return html;
  }

  render_values() {
    let rows = [];

    for (var y = 0; y < this.table.rows.length; y++) {
      let row = this.table.rows[y];
      let new_row = [];
      for (var i = 0; i < this.table.columns.length; i++) {
        new_row.push(this.formatColumnValue(i, row[i]));
      }
      rows.push(new_row);
    }
    return {
        columns: this.table.columns,
        rows: rows,
    };
  }
}
