///<reference path="../../../headers/common.d.ts" />
System.register(["lodash", "moment", "app/core/utils/kbn", "jquery", "json-formatter-js"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lodash_1, moment_1, kbn_1, jquery_1, json_formatter_js_1, TableRenderer;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (moment_1_1) {
                moment_1 = moment_1_1;
            },
            function (kbn_1_1) {
                kbn_1 = kbn_1_1;
            },
            function (jquery_1_1) {
                jquery_1 = jquery_1_1;
            },
            function (json_formatter_js_1_1) {
                json_formatter_js_1 = json_formatter_js_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            TableRenderer = (function () {
                function TableRenderer(panel, table, isUtc, sanitize) {
                    this.panel = panel;
                    this.table = table;
                    this.isUtc = isUtc;
                    this.sanitize = sanitize;
                    this.initColumns();
                }
                TableRenderer.prototype.setTable = function (table) {
                    this.table = table;
                    this.initColumns();
                };
                TableRenderer.prototype.initColumns = function () {
                    this.formatters = [];
                    this.colorState = {};
                    for (var colIndex = 0; colIndex < this.table.columns.length; colIndex++) {
                        var column = this.table.columns[colIndex];
                        column.title = column.text;
                        for (var i = 0; i < this.panel.styles.length; i++) {
                            var style = this.panel.styles[i];
                            var regex = kbn_1.default.stringToJsRegex(style.pattern);
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
                };
                TableRenderer.prototype.getColorForValue = function (value, style) {
                    if (!style.thresholds) {
                        return null;
                    }
                    for (var i = style.thresholds.length; i > 0; i--) {
                        if (value >= style.thresholds[i - 1]) {
                            return style.colors[i];
                        }
                    }
                    return lodash_1.default.first(style.colors);
                };
                TableRenderer.prototype.defaultCellFormatter = function (v, style) {
                    if (v === null || v === void 0 || v === undefined) {
                        return '';
                    }
                    if (lodash_1.default.isArray(v)) {
                        v = v.join(', ');
                    }
                    if (style && style.sanitize) {
                        return this.sanitize(v);
                    }
                    else {
                        return lodash_1.default.escape(v);
                    }
                };
                TableRenderer.prototype.createColumnFormatter = function (column) {
                    var _this = this;
                    if (!column.style) {
                        return this.defaultCellFormatter;
                    }
                    if (column.style.type === 'hidden') {
                        return function (v) {
                            return undefined;
                        };
                    }
                    if (column.style.type === 'date') {
                        return function (v) {
                            if (v === undefined || v === null) {
                                return '-';
                            }
                            if (lodash_1.default.isArray(v)) {
                                v = v[0];
                            }
                            var date = moment_1.default(v);
                            if (_this.isUtc) {
                                date = date.utc();
                            }
                            return date.format(column.style.dateFormat);
                        };
                    }
                    if (column.style.type === 'number') {
                        var valueFormatter_1 = kbn_1.default.valueFormats[column.unit || column.style.unit];
                        return function (v) {
                            if (v === null || v === void 0) {
                                return '-';
                            }
                            if (lodash_1.default.isString(v)) {
                                return _this.defaultCellFormatter(v, column.style);
                            }
                            if (column.style.colorMode) {
                                _this.colorState[column.style.colorMode] = _this.getColorForValue(v, column.style);
                            }
                            return valueFormatter_1(v, column.style.decimals, null);
                        };
                    }
                    return function (value) {
                        return _this.defaultCellFormatter(value, column.style);
                    };
                };
                TableRenderer.prototype.formatColumnValue = function (colIndex, value) {
                    return this.formatters[colIndex] ? this.formatters[colIndex](value) : value;
                };
                TableRenderer.prototype.getMatchedStyle = function (colIndex) {
                    for (var i = 0; i < this.panel.styles.length; i++) {
                        var style = this.panel.styles[i];
                        var column = this.table.columns[colIndex];
                        var regex = kbn_1.default.stringToJsRegex(style.pattern);
                        if (column.text.match(regex)) {
                            return style;
                        }
                    }
                };
                TableRenderer.prototype.renderCell = function (columnIndex, value, addWidthHack) {
                    if (addWidthHack === void 0) { addWidthHack = false; }
                    value = this.formatColumnValue(columnIndex, value);
                    var style = '';
                    if (this.colorState.cell) {
                        style = ' style="background-color:' + this.colorState.cell + ';color: white"';
                        this.colorState.cell = null;
                    }
                    else if (this.colorState.value) {
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
                    }
                    else {
                        this.table.columns[columnIndex].hidden = false;
                    }
                    function formatCellValue(value) {
                        var cell = jquery_1.default('<td' + style + '></td>');
                        function isJSON(value) {
                            try {
                                JSON.parse(lodash_1.default.unescape(value));
                                return true;
                            }
                            catch (e) {
                                return false;
                            }
                        }
                        function toggleView(button, showedView, hiddenView) {
                            jquery_1.default('.switcher').removeClass('active focus');
                            button.addClass('active focus');
                            showedView.show();
                            hiddenView.hide();
                        }
                        // To prevent a number from being stringified
                        if (isJSON(value) && isNaN(Number.parseFloat(value))) {
                            var json = JSON.parse(lodash_1.default.unescape(value));
                            var jsonTree_1 = jquery_1.default('<div class="json-view"></div>')
                                .append(new json_formatter_js_1.default(json, 1, {
                                theme: 'dark'
                            }).render());
                            var jsonText_1 = jquery_1.default('<pre class="text-view" style="display: none;">' + JSON.stringify(json, null, '  ') + '</pre>');
                            var jsonViewer = jquery_1.default('<div class="json-viewer"></div>');
                            var viewSwitcherWrapper = jquery_1.default('<div class="json-view-switcher"></div>');
                            var textSwitcher = jquery_1.default('<button class="switcher text-switcher btn btn-inverse btn-mini">Text</button>');
                            var jsonSwitcher = jquery_1.default('<button class="switcher json-switcher btn btn-inverse btn-mini active focus">JSON</button>')
                                .click(function () {
                                toggleView(jquery_1.default(this), jsonTree_1, jsonText_1);
                            });
                            textSwitcher.click(function () {
                                toggleView(jquery_1.default(this), jsonText_1, jsonTree_1);
                            });
                            viewSwitcherWrapper.append(jsonSwitcher, textSwitcher);
                            jsonViewer
                                .append(viewSwitcherWrapper)
                                .append(jsonTree_1)
                                .append(jsonText_1);
                            return cell.append(jsonViewer);
                        }
                        else {
                            return cell.html(value + widthHack);
                        }
                    }
                    return formatCellValue(value);
                };
                TableRenderer.prototype.render = function (page) {
                    var pageSize = this.panel.pageSize || 100;
                    var startPos = page * pageSize;
                    var endPos = Math.min(startPos + pageSize, this.table.rows.length);
                    var html = [];
                    for (var y = startPos; y < endPos; y++) {
                        var row = this.table.rows[y];
                        var cellHtml = [];
                        var rowStyle = '';
                        for (var i = 0; i < this.table.columns.length; i++) {
                            cellHtml.push(this.renderCell(i, row[i], y === startPos));
                        }
                        if (this.colorState.row) {
                            rowStyle = ' style="background-color:' + this.colorState.row + ';color: white"';
                            this.colorState.row = null;
                        }
                        var htmlRow = jquery_1.default('<tr ' + rowStyle + '></tr>');
                        htmlRow.append(cellHtml);
                        html.push(htmlRow);
                    }
                    return html;
                };
                TableRenderer.prototype.render_values = function () {
                    var rows = [];
                    for (var y = 0; y < this.table.rows.length; y++) {
                        var row = this.table.rows[y];
                        var new_row = [];
                        for (var i = 0; i < this.table.columns.length; i++) {
                            new_row.push(this.formatColumnValue(i, row[i]));
                        }
                        rows.push(new_row);
                    }
                    return {
                        columns: this.table.columns,
                        rows: rows,
                    };
                };
                return TableRenderer;
            }());
            exports_1("TableRenderer", TableRenderer);
        }
    };
});
//# sourceMappingURL=renderer.js.map