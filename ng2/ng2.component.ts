import {Component, Directive, ElementRef} from 'angular2/core';

@Directive({
    selector: '[myHighlight]'
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
      '<div myHighlight>test Highlgiht</div>',
    directives: [HighlightDirective]
})
export class AppComponent {}
