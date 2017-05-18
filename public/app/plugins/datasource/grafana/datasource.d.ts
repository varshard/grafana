/// <reference path="../../../../../public/app/headers/common.d.ts" />
declare class GrafanaDatasource {
    private backendSrv;
    private $q;
    /** @ngInject */
    constructor(backendSrv: any, $q: any);
    query(options: any): any;
    metricFindQuery(): any;
    annotationQuery(options: any): any;
}
export { GrafanaDatasource };
