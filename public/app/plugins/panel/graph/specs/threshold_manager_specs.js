///<reference path="../../../../headers/common.d.ts" />
System.register(["../../../../../test/lib/common", "../threshold_manager"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var common_1, threshold_manager_1;
    return {
        setters: [
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (threshold_manager_1_1) {
                threshold_manager_1 = threshold_manager_1_1;
            }
        ],
        execute: function () {///<reference path="../../../../headers/common.d.ts" />
            common_1.describe('ThresholdManager', function () {
                function plotOptionsScenario(desc, func) {
                    common_1.describe(desc, function () {
                        var ctx = {
                            panel: {
                                thresholds: [],
                            },
                            options: {
                                grid: { markings: [] },
                            },
                            panelCtrl: {},
                        };
                        ctx.setup = function (thresholds) {
                            ctx.panel.thresholds = thresholds;
                            var manager = new threshold_manager_1.ThresholdManager(ctx.panelCtrl);
                            manager.addFlotOptions(ctx.options, ctx.panel);
                        };
                        func(ctx);
                    });
                }
                common_1.describe("When creating plot markings", function () {
                    plotOptionsScenario("for simple gt threshold", function (ctx) {
                        ctx.setup([
                            { op: 'gt', value: 300, fill: true, line: true, colorMode: 'critical' },
                        ]);
                        common_1.it('should add fill for threshold with fill: true', function () {
                            var markings = ctx.options.grid.markings;
                            common_1.expect(markings[0].yaxis.from).to.be(300);
                            common_1.expect(markings[0].yaxis.to).to.be(Infinity);
                            common_1.expect(markings[0].color).to.be('rgba(234, 112, 112, 0.12)');
                        });
                        common_1.it('should add line', function () {
                            var markings = ctx.options.grid.markings;
                            common_1.expect(markings[1].yaxis.from).to.be(300);
                            common_1.expect(markings[1].yaxis.to).to.be(300);
                            common_1.expect(markings[1].color).to.be('rgba(237, 46, 24, 0.60)');
                        });
                    });
                    plotOptionsScenario("for two gt thresholds", function (ctx) {
                        ctx.setup([
                            { op: 'gt', value: 200, fill: true, colorMode: 'warning' },
                            { op: 'gt', value: 300, fill: true, colorMode: 'critical' },
                        ]);
                        common_1.it('should add fill for first thresholds to next threshold', function () {
                            var markings = ctx.options.grid.markings;
                            common_1.expect(markings[0].yaxis.from).to.be(200);
                            common_1.expect(markings[0].yaxis.to).to.be(300);
                        });
                        common_1.it('should add fill for last thresholds to infinity', function () {
                            var markings = ctx.options.grid.markings;
                            common_1.expect(markings[1].yaxis.from).to.be(300);
                            common_1.expect(markings[1].yaxis.to).to.be(Infinity);
                        });
                    });
                    plotOptionsScenario("for lt then gt threshold (inside)", function (ctx) {
                        ctx.setup([
                            { op: 'lt', value: 300, fill: true, colorMode: 'critical' },
                            { op: 'gt', value: 200, fill: true, colorMode: 'critical' },
                        ]);
                        common_1.it('should add fill for first thresholds to next threshold', function () {
                            var markings = ctx.options.grid.markings;
                            common_1.expect(markings[0].yaxis.from).to.be(300);
                            common_1.expect(markings[0].yaxis.to).to.be(200);
                        });
                        common_1.it('should add fill for last thresholds to itself', function () {
                            var markings = ctx.options.grid.markings;
                            common_1.expect(markings[1].yaxis.from).to.be(200);
                            common_1.expect(markings[1].yaxis.to).to.be(200);
                        });
                    });
                    plotOptionsScenario("for gt then lt threshold (outside)", function (ctx) {
                        ctx.setup([
                            { op: 'gt', value: 300, fill: true, colorMode: 'critical' },
                            { op: 'lt', value: 200, fill: true, colorMode: 'critical' },
                        ]);
                        common_1.it('should add fill for first thresholds to next threshold', function () {
                            var markings = ctx.options.grid.markings;
                            common_1.expect(markings[0].yaxis.from).to.be(300);
                            common_1.expect(markings[0].yaxis.to).to.be(Infinity);
                        });
                        common_1.it('should add fill for last thresholds to itself', function () {
                            var markings = ctx.options.grid.markings;
                            common_1.expect(markings[1].yaxis.from).to.be(200);
                            common_1.expect(markings[1].yaxis.to).to.be(-Infinity);
                        });
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=threshold_manager_specs.js.map