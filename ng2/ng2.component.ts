import {Component, Directive, ElementRef, Input} from 'angular2/core';

@Directive({
    selector: '[myHighlight]',
    host: {
      '(mousemove)': 'onMouseEnter()',
      '(mouseleave)': 'onMouseLeave()'
    }
})
export class HighlightDirective {
  @Input('myVar') myVar: string;
  
  //@Input('myHighlight') highlightColor: string;
  
  constructor(private el: ElementRef) {
    this.highlight('yellow');
    console.log('myVar = ' + this.myVar)
    this.myVar = 'world';
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
      '<div myHighlight [myVar]="\'test\'">ng2Component</div>'
    ,
    directives: [HighlightDirective]
})
export class AppComponent {}
