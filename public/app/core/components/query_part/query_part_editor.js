///<reference path="../../../headers/common.d.ts" />
System.register(["lodash", "jquery", "app/core/core_module"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    /** @ngInject */
    function queryPartEditorDirective($compile, templateSrv) {
        var paramTemplate = '<input type="text" class="hide input-mini tight-form-func-param"></input>';
        return {
            restrict: 'E',
            template: template,
            scope: {
                part: "=",
                handleEvent: "&",
            },
            link: function postLink($scope, elem) {
                var part = $scope.part;
                var partDef = part.def;
                var $paramsContainer = elem.find('.query-part-parameters');
                $scope.partActions = [];
                function clickFuncParam(paramIndex) {
                    /*jshint validthis:true */
                    var $link = jquery_1.default(this);
                    var $input = $link.next();
                    $input.val(part.params[paramIndex]);
                    $input.css('width', ($link.width() + 16) + 'px');
                    $link.hide();
                    $input.show();
                    $input.focus();
                    $input.select();
                    var typeahead = $input.data('typeahead');
                    if (typeahead) {
                        $input.val('');
                        typeahead.lookup();
                    }
                }
                function inputBlur(paramIndex) {
                    /*jshint validthis:true */
                    var $input = jquery_1.default(this);
                    var $link = $input.prev();
                    var newValue = $input.val();
                    if (newValue !== '' || part.def.params[paramIndex].optional) {
                        $link.html(templateSrv.highlightVariablesAsHtml(newValue));
                        part.updateParam($input.val(), paramIndex);
                        $scope.$apply(function () {
                            $scope.handleEvent({ $event: { name: 'part-param-changed' } });
                        });
                    }
                    $input.hide();
                    $link.show();
                }
                function inputKeyPress(paramIndex, e) {
                    /*jshint validthis:true */
                    if (e.which === 13) {
                        inputBlur.call(this, paramIndex);
                    }
                }
                function inputKeyDown() {
                    /*jshint validthis:true */
                    this.style.width = (3 + this.value.length) * 8 + 'px';
                }
                function addTypeahead($input, param, paramIndex) {
                    if (!param.options && !param.dynamicLookup) {
                        return;
                    }
                    var typeaheadSource = function (query, callback) {
                        if (param.options) {
                            var options = param.options;
                            if (param.type === 'int') {
                                options = lodash_1.default.map(options, function (val) { return val.toString(); });
                            }
                            return options;
                        }
                        $scope.$apply(function () {
                            $scope.handleEvent({ $event: { name: 'get-param-options' } }).then(function (result) {
                                var dynamicOptions = lodash_1.default.map(result, function (op) { return op.value; });
                                callback(dynamicOptions);
                            });
                        });
                    };
                    $input.attr('data-provide', 'typeahead');
                    $input.typeahead({
                        source: typeaheadSource,
                        minLength: 0,
                        items: 1000,
                        updater: function (value) {
                            setTimeout(function () {
                                inputBlur.call($input[0], paramIndex);
                            }, 0);
                            return value;
                        }
                    });
                    var typeahead = $input.data('typeahead');
                    typeahead.lookup = function () {
                        this.query = this.$element.val() || '';
                        var items = this.source(this.query, jquery_1.default.proxy(this.process, this));
                        return items ? this.process(items) : items;
                    };
                }
                $scope.showActionsMenu = function () {
                    $scope.handleEvent({ $event: { name: 'get-part-actions' } }).then(function (res) {
                        $scope.partActions = res;
                    });
                };
                $scope.triggerPartAction = function (action) {
                    $scope.handleEvent({ $event: { name: 'action', action: action } });
                };
                function addElementsAndCompile() {
                    lodash_1.default.each(partDef.params, function (param, index) {
                        if (param.optional && part.params.length <= index) {
                            return;
                        }
                        if (index > 0) {
                            jquery_1.default('<span>, </span>').appendTo($paramsContainer);
                        }
                        var paramValue = templateSrv.highlightVariablesAsHtml(part.params[index]);
                        var $paramLink = jquery_1.default('<a class="graphite-func-param-link pointer">' + paramValue + '</a>');
                        var $input = jquery_1.default(paramTemplate);
                        $paramLink.appendTo($paramsContainer);
                        $input.appendTo($paramsContainer);
                        $input.blur(lodash_1.default.partial(inputBlur, index));
                        $input.keyup(inputKeyDown);
                        $input.keypress(lodash_1.default.partial(inputKeyPress, index));
                        $paramLink.click(lodash_1.default.partial(clickFuncParam, index));
                        addTypeahead($input, param, index);
                    });
                }
                function relink() {
                    $paramsContainer.empty();
                    addElementsAndCompile();
                }
                relink();
            }
        };
    }
    exports_1("queryPartEditorDirective", queryPartEditorDirective);
    var lodash_1, jquery_1, core_module_1, template;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (jquery_1_1) {
                jquery_1 = jquery_1_1;
            },
            function (core_module_1_1) {
                core_module_1 = core_module_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            template = "\n<div class=\"dropdown cascade-open\">\n<a ng-click=\"showActionsMenu()\" class=\"query-part-name pointer dropdown-toggle\" data-toggle=\"dropdown\">{{part.def.type}}</a>\n<span>(</span><span class=\"query-part-parameters\"></span><span>)</span>\n<ul class=\"dropdown-menu\">\n  <li ng-repeat=\"action in partActions\">\n    <a ng-click=\"triggerPartAction(action)\">{{action.text}}</a>\n  </li>\n</ul>\n";
            core_module_1.default.directive('queryPartEditor', queryPartEditorDirective);
        }
    };
});
//# sourceMappingURL=query_part_editor.js.map