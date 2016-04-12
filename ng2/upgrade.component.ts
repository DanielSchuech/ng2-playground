import {Component, Directive, ElementRef, Input} from 'angular2/core';
import {UpgradeAdapter} from 'angular2/upgrade';

import {ngAdapter} from 'ngAdapter/build/ngAdapter';

let module = angular.module('newApp', ['ngMaterial']);
let adapter = new ngAdapter(module);

module.directive('testbtn', MdButtonDirective);

adapter.upgradeNg1Provider('$mdButtonInkRipple');
adapter.upgradeNg1Provider('$mdTheming');
adapter.upgradeNg1Provider('$mdAria');

@Component({
    selector: 'my-ng2-component',
    template: '<h1>My First Angular 2 App</h1>' +
      '<div>Hello World</div>' +
      '<div md-button class="md-raised md-primary" test-class="css"> Flat Button </div>' +
      '<div>------------------End ng2--------------</div>'
    ,
    directives: [adapter.upgradeNg1Directive('mdButton')]
})
export class AppComponent {}

module.directive('myNg2Component', <any>adapter.downgradeNg2Component(AppComponent));

adapter.bootstrap(document.body, ['newApp']);

function MdButtonDirective($mdButtonInkRipple: any, $mdTheming: any, $mdAria: any, $timeout: any) {

  return {
    restrict: 'EA',
    replace: false,
    transclude: true,
    template: getTemplate,
    link: postLink
  };

  function isAnchor(attr: any) {
    return angular.isDefined(attr.href) || angular.isDefined(attr.ngHref) || angular.isDefined(attr.ngLink) || angular.isDefined(attr.uiSref);
  }

  function getTemplate(element: any, attr: any) {
    if (isAnchor(attr)) {
      return '<a class="md-button" ng-transclude></a>';
    } else {
      //If buttons don't have type="button", they will submit forms automatically.
      var btnType = (typeof attr.type === 'undefined') ? 'button' : attr.type;
      return '<button class="md-button" type="' + btnType + '" ng-transclude></button>';
    }
  }

  function postLink(scope: any, element: any, attr: any) {
    $mdTheming(element);
    $mdButtonInkRipple.attach(scope, element);

    // Use async expect to support possible bindings in the button label
    $mdAria.expectWithText(element, 'aria-label');

    // For anchor elements, we have to set tabindex manually when the
    // element is disabled
    if (isAnchor(attr) && angular.isDefined(attr.ngDisabled) ) {
      scope.$watch(attr.ngDisabled, function(isDisabled: any) {
        element.attr('tabindex', isDisabled ? -1 : 0);
      });
    }

    // disabling click event when disabled is true
    element.on('click', function(e: any){
      if (attr.disabled === true) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    });

    if (!angular.isDefined(attr.mdNoFocusStyle)) {
      // restrict focus styles to the keyboard
      scope.mouseActive = false;
      element.on('mousedown', function() {
        scope.mouseActive = true;
        $timeout(function(){
          scope.mouseActive = false;
        }, 100);
      })
      .on('focus', function() {
        if (scope.mouseActive === false) {
          element.addClass('md-focused');
        }
      })
      .on('blur', function(ev: any) {
        element.removeClass('md-focused');
      });
    }
  }

}