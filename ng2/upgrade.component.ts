import {Component, Directive, ElementRef, Input} from 'angular2/core';
import {UpgradeAdapter} from 'angular2/upgrade';
import {EventService} from './event.service';

import {ngAdapter} from 'ngAdapter/build/ngAdapter'; 

class ng1TestService {
  public arg = 'it worked';
}

HighlightDirective.$inject = ['EventService', 'ng1TestService'];
function HighlightDirective(event: EventService, test: ng1TestService) {
  return {
    scope: {
      myVar: '='
    },
    link: (scope: any, element: any, attrs: any) => {scope.myVar = 'newVar'
      element[0].style.backgroundColor = 'Yellow';
      
      event.event.subscribe((data: string) => {
      element[0].textContent = data;
      });
      
      element[0].addEventListener('mouseenter', () => {
        element[0].style.backgroundColor = 'Red';
      });
      element[0].addEventListener('mouseleave', () => {
        element[0].style.backgroundColor = 'Yellow';
      });
    }
  }
}

let module = angular.module('newApp', ['app']);

module.service('ng1TestService', ng1TestService); 

let adapter = new ngAdapter(module);
adapter.upgradeNg1Provider('ng1TestService'); 
adapter.addProvider(EventService);

module.controller('ctrl', ['$scope', (scope: any) => {
    scope.test = 'hello';
  }])
  .factory('EventService', <any>adapter.downgradeNg2Provider(EventService));

  
module.directive('myHighlight', HighlightDirective);


@Component({
    selector: 'my-ng2-component',
    template: '<h1>My First Angular 2 App</h1>' +
      '{{testVar}}' +
      '<div myHighlight [(myVar)]="testVar">ng2Component</div>'
    ,
    providers: [EventService],
    directives: [adapter.upgradeNg1Directive('myHighlight')]
})
export class AppComponent {
  public testVar: string = "myTest"
}

module.directive('myNg2Component', <any>adapter.downgradeNg2Component(AppComponent));

adapter.bootstrap(document.body, ['newApp']);

function ng1TestServiceFN() {
  this.arg = 'A';
}