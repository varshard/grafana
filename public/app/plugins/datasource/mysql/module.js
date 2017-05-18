///<reference path="../../../headers/common.d.ts" />
System.register(["./datasource", "./query_ctrl"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var datasource_1, query_ctrl_1, MysqlConfigCtrl;
    return {
        setters: [
            function (datasource_1_1) {
                datasource_1 = datasource_1_1;
            },
            function (query_ctrl_1_1) {
                query_ctrl_1 = query_ctrl_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            exports_1("MysqlDatasource", datasource_1.MysqlDatasource);
            exports_1("Datasource", datasource_1.MysqlDatasource);
            exports_1("QueryCtrl", query_ctrl_1.MysqlQueryCtrl);
            MysqlConfigCtrl = (function () {
                function MysqlConfigCtrl() {
                }
                return MysqlConfigCtrl;
            }());
            MysqlConfigCtrl.templateUrl = 'partials/config.html';
            exports_1("ConfigCtrl", MysqlConfigCtrl);
        }
    };
});
//# sourceMappingURL=module.js.map