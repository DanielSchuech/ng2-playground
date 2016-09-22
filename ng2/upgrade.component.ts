import {Component, Directive, ElementRef, Input, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
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
    link: (scope: any, element: any, attrs: any) => {console.log('link HighlightDirective')
      scope.myVar = 'newVar'
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

function HighlightDirective2() {
  return {
    link: (scope: any, element: any, attrs: any) => {
      element[0].style.backgroundColor = 'Green';
    }
  }
}

let module = angular.module('newApp', ['AppModule']);

module.service('ng1TestService', ng1TestService); 

let adapter = new ngAdapter(module);
adapter.upgradeNg1Provider('ng1TestService');
// adapter.addProvider(EventService);

module.controller('ctrl', ['$scope', (scope: any) => {
    scope.test = 'hello';
  }])
  .factory('EventService', <any>adapter.downgradeNg2Provider(EventService));

  
module.directive('myHighlight', HighlightDirective);
module.directive('myHighlight2', HighlightDirective2);

@Component({
    selector: 'my-ng2-component',
    template: '<h1>My First Angular 2 App</h1>' +
      '{{testVar}}' +
      '<div myHighlight [(myVar)]="testVar">ng2Component</div>' +
      '<div myHighlight2>2. Directive</div>'
})
export class AppComponent {
  public testVar: string = "myTest"
}

@NgModule({
  imports: [BrowserModule],
  declarations: [
    adapter.upgradeNg1Directive('myHighlight'),
    adapter.upgradeNg1Directive('myHighlight2'),
    AppComponent],
  exports: [AppComponent],
  providers: [EventService]
})
class AppModule {}
adapter.addNg2Module(AppModule);
adapter.downgradeNg2Module(AppModule);

adapter.bootstrap(document.body, ['newApp']);

function ng1TestServiceFN() {
  this.arg = 'A';
}