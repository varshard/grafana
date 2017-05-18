System.register(["./annotations_srv", "./event_editor", "./event_manager", "./event"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var annotations_srv_1, event_editor_1, event_manager_1, event_1;
    return {
        setters: [
            function (annotations_srv_1_1) {
                annotations_srv_1 = annotations_srv_1_1;
            },
            function (event_editor_1_1) {
                event_editor_1 = event_editor_1_1;
            },
            function (event_manager_1_1) {
                event_manager_1 = event_manager_1_1;
            },
            function (event_1_1) {
                event_1 = event_1_1;
            }
        ],
        execute: function () {
            exports_1("AnnotationsSrv", annotations_srv_1.AnnotationsSrv);
            exports_1("eventEditor", event_editor_1.eventEditor);
            exports_1("EventManager", event_manager_1.EventManager);
            exports_1("AnnotationEvent", event_1.AnnotationEvent);
        }
    };
});
//# sourceMappingURL=all.js.map