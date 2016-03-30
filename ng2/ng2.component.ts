import {Component, Directive, ElementRef} from 'angular2/core';

@Directive({
    selector: '[myHighlightNG2]'
})
export class HighlightDirective {
  
  constructor(el: ElementRef) {
    el.nativeElement.style.backgroundColor = 'yellow';
  }
}

@Component({
    selector: 'my-ng2-component',
    template: '<h1>My First Angular 2 App</h1>' +
      '<div>test</div>' +
      '<div [myHighlightNG2]>test Highlgiht</div>',
    directives: [HighlightDirective]
})
export class AppComponent {}
