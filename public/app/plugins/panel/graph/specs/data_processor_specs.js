///<reference path="../../../../headers/common.d.ts" />
System.register(["../../../../../test/lib/common", "../data_processor"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var common_1, data_processor_1;
    return {
        setters: [
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (data_processor_1_1) {
                data_processor_1 = data_processor_1_1;
            }
        ],
        execute: function () {///<reference path="../../../../headers/common.d.ts" />
            common_1.describe('Graph DataProcessor', function () {
                var panel = {
                    xaxis: {}
                };
                var processor = new data_processor_1.DataProcessor(panel);
                var seriesList;
                common_1.describe('Given default xaxis options and query that returns docs', function () {
                    common_1.beforeEach(function () {
                        panel.xaxis.mode = 'time';
                        panel.xaxis.name = 'hostname';
                        panel.xaxis.values = [];
                        seriesList = processor.getSeriesList({
                            dataList: [
                                {
                                    type: 'docs',
                                    datapoints: [{ hostname: "server1", avg: 10 }]
                                }
                            ]
                        });
                    });
                    common_1.it('Should automatically set xaxis mode to field', function () {
                        common_1.expect(panel.xaxis.mode).to.be('field');
                    });
                });
                common_1.describe('getDataFieldNames(', function () {
                    var dataList = [{
                            type: 'docs', datapoints: [
                                {
                                    hostname: "server1",
                                    valueField: 11,
                                    nested: {
                                        prop1: 'server2', value2: 23
                                    }
                                }
                            ]
                        }];
                    common_1.it('Should return all field names', function () {
                        var fields = processor.getDataFieldNames(dataList, false);
                        common_1.expect(fields).to.contain('hostname');
                        common_1.expect(fields).to.contain('valueField');
                        common_1.expect(fields).to.contain('nested.prop1');
                        common_1.expect(fields).to.contain('nested.value2');
                    });
                    common_1.it('Should return all number fields', function () {
                        var fields = processor.getDataFieldNames(dataList, true);
                        common_1.expect(fields).to.contain('valueField');
                        common_1.expect(fields).to.contain('nested.value2');
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data_processor_specs.js.map