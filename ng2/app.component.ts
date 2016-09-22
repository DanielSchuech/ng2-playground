import {Component, Directive, ElementRef, Input, NgModule} from '@angular/core';
import {EventService} from './event.service';

import {ngAdapter} from 'ngAdapter/build/ngAdapter'; 

//const SimpleDirective = upgradeAdapter.upgradeNg1Component('simple'); 
//const Highlight = upgradeAdapter.upgradeNg1Component('highlight');

@Directive({
    selector: '[myHighlight]',
    host: {
      '(mouseenter)': 'onMouseEnter()',
      '(mouseleave)': 'onMouseLeave()'
    }
})
export class HighlightDirective {
  @Input('myVar') myVar: string;
  
  constructor(event: EventService, private el: ElementRef) {
    this.highlight('yellow');
    console.log('myVar = ' + this.myVar)
    this.myVar = 'world';
    
    event.event.subscribe((data: string) => {
      el.nativeElement.textContent = data;
    });
  }
  
  highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
  
  onMouseEnter() {
    this.highlight('red');
  }
  onMouseLeave() {
    this.highlight('yellow');
  }
}

@Component({
    selector: 'my-ng2-component',
    template: '<h1>My First Angular 2 App</h1>' +
      '<div myHighlight [myVar]="\'ng2Highlight\'">ng2Component</div>'
    ,
    providers: [EventService]
})
export class AppComponent {}

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}


let module = angular.module('newApp', ['app']);
let adapter = new ngAdapter(module);
// adapter.addProvider(EventService);

module.controller('ctrl', ['$scope', (scope: any) => {
    scope.test = 'hello';
  }])
  .directive('myNg2Component', <any>adapter.downgradeNg2Component(AppComponent))
  .factory('EventService', <any>adapter.downgradeNg2Provider(EventService))
  .directive('myHighlight', <any>adapter.downgradeNg2Directive(HighlightDirective));

// adapter.bootstrap(document.body, ['newApp']);
