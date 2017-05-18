///<reference path="../../../headers/common.d.ts" />
System.register(["lodash"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lodash_1, MysqlDatasource;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            MysqlDatasource = (function () {
                /** @ngInject **/
                function MysqlDatasource(instanceSettings, backendSrv, $q, templateSrv) {
                    this.backendSrv = backendSrv;
                    this.$q = $q;
                    this.templateSrv = templateSrv;
                    this.name = instanceSettings.name;
                    this.id = instanceSettings.id;
                }
                MysqlDatasource.prototype.interpolateVariable = function (value) {
                    if (typeof value === 'string') {
                        return '\"' + value + '\"';
                    }
                    var quotedValues = lodash_1.default.map(value, function (val) {
                        return '\"' + val + '\"';
                    });
                    return quotedValues.join(',');
                };
                MysqlDatasource.prototype.query = function (options) {
                    var _this = this;
                    var queries = lodash_1.default.filter(options.targets, function (item) {
                        return item.hide !== true;
                    }).map(function (item) {
                        return {
                            refId: item.refId,
                            intervalMs: options.intervalMs,
                            maxDataPoints: options.maxDataPoints,
                            datasourceId: _this.id,
                            rawSql: _this.templateSrv.replace(item.rawSql, options.scopedVars, _this.interpolateVariable),
                            format: item.format,
                        };
                    });
                    if (queries.length === 0) {
                        return this.$q.when({ data: [] });
                    }
                    return this.backendSrv.datasourceRequest({
                        url: '/api/tsdb/query',
                        method: 'POST',
                        data: {
                            from: options.range.from.valueOf().toString(),
                            to: options.range.to.valueOf().toString(),
                            queries: queries,
                        }
                    }).then(this.processQueryResult.bind(this));
                };
                MysqlDatasource.prototype.testDatasource = function () {
                    return this.backendSrv.datasourceRequest({
                        url: '/api/tsdb/query',
                        method: 'POST',
                        data: {
                            from: '5m',
                            to: 'now',
                            queries: [{
                                    refId: 'A',
                                    intervalMs: 1,
                                    maxDataPoints: 1,
                                    datasourceId: this.id,
                                    rawSql: "SELECT 1",
                                    format: 'table',
                                }],
                        }
                    }).then(function (res) {
                        return { status: "success", message: "Database Connection OK", title: "Success" };
                    }).catch(function (err) {
                        console.log(err);
                        if (err.data && err.data.message) {
                            return { status: "error", message: err.data.message, title: "Error" };
                        }
                        else {
                            return { status: "error", message: err.status, title: "Error" };
                        }
                    });
                };
                MysqlDatasource.prototype.processQueryResult = function (res) {
                    var data = [];
                    if (!res.data.results) {
                        return { data: data };
                    }
                    for (var key in res.data.results) {
                        var queryRes = res.data.results[key];
                        if (queryRes.series) {
                            for (var _i = 0, _a = queryRes.series; _i < _a.length; _i++) {
                                var series = _a[_i];
                                data.push({
                                    target: series.name,
                                    datapoints: series.points,
                                    refId: queryRes.refId,
                                    meta: queryRes.meta,
                                });
                            }
                        }
                        if (queryRes.tables) {
                            for (var _b = 0, _c = queryRes.tables; _b < _c.length; _b++) {
                                var table = _c[_b];
                                table.type = 'table';
                                table.refId = queryRes.refId;
                                table.meta = queryRes.meta;
                                data.push(table);
                            }
                        }
                    }
                    return { data: data };
                };
                return MysqlDatasource;
            }());
            exports_1("MysqlDatasource", MysqlDatasource);
        }
    };
});
//# sourceMappingURL=datasource.js.map