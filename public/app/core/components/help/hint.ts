///<reference path="../../../headers/common.d.ts" />

import coreModule from '../../core_module';

export class HintCtrl {

  /** @ngInject */
  constructor(private backendSrv) {
    console.log('hint ctrl');
  }

  markAsSeen() {
    console.log('mark as seen');
  }
}

export function hintTooltip() {
  return {
    restrict: 'E',
    template: `
      <div class="dissable-hint">
        <ng-transclude></ng-transclude><br />
      </div>
    `,
    controller: HintCtrl,
    bindToController: true,
    transclude: true,
    controllerAs: 'ctrl',
    scope: {},
    link() {
      console.log('link');
    }
  };
}

coreModule.directive('hintTooltip', hintTooltip);
