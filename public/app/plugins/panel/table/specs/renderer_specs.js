System.register(["test/lib/common", "app/core/table_model", "../renderer"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var common_1, table_model_1, renderer_1;
    return {
        setters: [
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (table_model_1_1) {
                table_model_1 = table_model_1_1;
            },
            function (renderer_1_1) {
                renderer_1 = renderer_1_1;
            }
        ],
        execute: function () {
            common_1.describe('when rendering table', function () {
                common_1.describe('given 2 columns', function () {
                    var table = new table_model_1.default();
                    table.columns = [
                        { text: 'Time' },
                        { text: 'Value' },
                        { text: 'Colored' },
                        { text: 'Undefined' },
                        { text: 'String' },
                        { text: 'United', unit: 'bps' },
                        { text: 'Sanitized' },
                        { text: 'JSON' }
                    ];
                    var panel = {
                        pageSize: 10,
                        styles: [
                            {
                                pattern: 'Time',
                                type: 'date',
                                format: 'LLL',
                                alias: 'Timestamp'
                            },
                            {
                                pattern: '/(Val)ue/',
                                type: 'number',
                                unit: 'ms',
                                decimals: 3,
                                alias: '$1'
                            },
                            {
                                pattern: 'Colored',
                                type: 'number',
                                unit: 'none',
                                decimals: 1,
                                colorMode: 'value',
                                thresholds: [50, 80],
                                colors: ['green', 'orange', 'red']
                            },
                            {
                                pattern: 'String',
                                type: 'string',
                            },
                            {
                                pattern: 'United',
                                type: 'number',
                                unit: 'ms',
                                decimals: 2,
                            },
                            {
                                pattern: 'Sanitized',
                                type: 'string',
                                sanitize: true,
                            },
                            {
                                pattern: 'JSON',
                                type: 'string'
                            }
                        ]
                    };
                    var sanitize = function (value) {
                        return 'sanitized';
                    };
                    var renderer = new renderer_1.TableRenderer(panel, table, 'utc', sanitize);
                    common_1.it('time column should be formated', function () {
                        var html = renderer.renderCell(0, 1388556366666);
                        common_1.expect(html.is('td')).to.be(true);
                        common_1.expect(html.html()).to.be('2014-01-01T06:06:06Z');
                    });
                    common_1.it('undefined time column should be rendered as -', function () {
                        var html = renderer.renderCell(0, undefined);
                        common_1.expect(html.is('td')).to.be(true);
                        common_1.expect(html.html()).to.be('-');
                    });
                    common_1.it('null time column should be rendered as -', function () {
                        var html = renderer.renderCell(0, null);
                        common_1.expect(html.is('td')).to.be(true);
                        common_1.expect(html.html()).to.be('-');
                    });
                    common_1.it('number column with unit specified should ignore style unit', function () {
                        var html = renderer.renderCell(5, 1230);
                        common_1.expect(html.is('td')).to.be(true);
                        common_1.expect(html.html()).to.be('1.23 kbps');
                    });
                    common_1.it('number column should be formated', function () {
                        var html = renderer.renderCell(1, 1230);
                        common_1.expect(html.is('td')).to.be(true);
                        common_1.expect(html.html()).to.be('1.230 s');
                    });
                    common_1.it('number style should ignore string values', function () {
                        var html = renderer.renderCell(1, 'asd');
                        common_1.expect(html.is('td')).to.be(true);
                        common_1.expect(html.html()).to.be('asd');
                    });
                    common_1.it('colored cell should have style', function () {
                        var html = renderer.renderCell(2, 40);
                        common_1.expect(html.is('td')).to.be(true);
                        common_1.expect(html.css('color')).to.be('green');
                        common_1.expect(html.html()).to.be('40.0');
                    });
                    common_1.it('colored cell should have style', function () {
                        var html = renderer.renderCell(2, 55);
                        common_1.expect(html.is('td')).to.be(true);
                        common_1.expect(html.css('color')).to.be('orange');
                        common_1.expect(html.html()).to.be('55.0');
                    });
                    common_1.it('colored cell should have style', function () {
                        var html = renderer.renderCell(2, 85);
                        common_1.expect(html.is('td')).to.be(true);
                        common_1.expect(html.css('color')).to.be('red');
                        common_1.expect(html.html()).to.be('85.0');
                    });
                    common_1.it('unformatted undefined should be rendered as string', function () {
                        var html = renderer.renderCell(3, 'value');
                        common_1.expect(html.is('td')).to.be(true);
                        common_1.expect(html.html()).to.be('value');
                    });
                    common_1.it('string style with escape html should return escaped html', function () {
                        var html = renderer.renderCell(4, "&breaking <br /> the <br /> row");
                        common_1.expect(html.is('td')).to.be(true);
                        common_1.expect(html.html()).to.be('&amp;breaking &lt;br /&gt; the &lt;br /&gt; row');
                    });
                    common_1.it('undefined formatter should return escaped html', function () {
                        var html = renderer.renderCell(3, "&breaking <br /> the <br /> row");
                        common_1.expect(html.is('td')).to.be(true);
                        common_1.expect(html.html()).to.be('&amp;breaking &lt;br /&gt; the &lt;br /&gt; row');
                    });
                    common_1.it('undefined value should render as -', function () {
                        var html = renderer.renderCell(3, undefined);
                        common_1.expect(html.is('td')).to.be(true);
                        common_1.expect(html.text()).to.be('');
                    });
                    common_1.it('sanitized value should render as', function () {
                        var html = renderer.renderCell(6, 'text <a href="http://google.com">link</a>');
                        common_1.expect(html.is('td')).to.be(true);
                        common_1.expect(html.html()).to.be('sanitized');
                    });
                    common_1.it('should insert .json-viewer if cell value is a json string', function () {
                        var html = renderer.renderCell(7, '{"legen": {"wait": {"forIt": "Dary"}}}');
                        common_1.expect(html.is('td')).to.be(true);
                        var jsonToggle = html.find('.json-switcher');
                        var textToggle = html.find('.text-switcher');
                        var jsonView = html.find('.json-view');
                        var textView = html.find('.text-view');
                        common_1.expect(jsonToggle.hasClass('active focus')).to.be(true);
                        common_1.expect(textToggle.hasClass('active focus')).to.be(false);
                        common_1.expect(jsonView.css('display')).to.not.equal('none');
                        // text view should be hidden by default
                        common_1.expect(textView.css('display')).to.equal('none');
                        textToggle.click();
                        common_1.expect(textView.css('display')).to.not.equal('none');
                        common_1.expect(jsonView.css('display')).to.equal('none');
                    });
                    common_1.it('should insert .json-viewer if cell value is an escaped json string', function () {
                        var html = renderer.renderCell(7, '{"legen": {"wait": {"forIt": "Dary"}}}');
                        common_1.expect(html.is('td')).to.be(true);
                        common_1.expect(html.find('.json-viewer')).to.not.be.undefined;
                    });
                    common_1.it('Time column title should be Timestamp', function () {
                        common_1.expect(table.columns[0].title).to.be('Timestamp');
                    });
                    common_1.it('Value column title should be Val', function () {
                        common_1.expect(table.columns[1].title).to.be('Val');
                    });
                    common_1.it('Colored column title should be Colored', function () {
                        common_1.expect(table.columns[2].title).to.be('Colored');
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=renderer_specs.js.map