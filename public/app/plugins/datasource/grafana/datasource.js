///<reference path="../../../headers/common.d.ts" />
System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var GrafanaDatasource;
    return {
        setters: [],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            GrafanaDatasource = (function () {
                /** @ngInject */
                function GrafanaDatasource(backendSrv, $q) {
                    this.backendSrv = backendSrv;
                    this.$q = $q;
                }
                GrafanaDatasource.prototype.query = function (options) {
                    return this.$q.when({ data: [] });
                };
                GrafanaDatasource.prototype.metricFindQuery = function () {
                    return this.$q.when([]);
                };
                GrafanaDatasource.prototype.annotationQuery = function (options) {
                    return this.backendSrv.get('/api/annotations', {
                        from: options.range.from.valueOf(),
                        to: options.range.to.valueOf(),
                        limit: options.limit,
                        type: options.type,
                    });
                };
                return GrafanaDatasource;
            }());
            exports_1("GrafanaDatasource", GrafanaDatasource);
        }
    };
});
//# sourceMappingURL=datasource.js.map