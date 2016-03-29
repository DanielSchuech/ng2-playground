import {Component, Directive, ElementRef, Input} from 'angular2/core';
import {UpgradeAdapter} from 'angular2/upgrade';

@Directive({
  selector: 'highlightcmp'
})
export class HighlightCmp {
  constructor(private el: ElementRef) {
    console.log(el.nativeElement);
  }
}

@Directive({
  selector: 'testing'
})
export class Testing{
  constructor() {
    console.log('hi')
  }
}

let upgradeAdapter = new UpgradeAdapter();
const SimpleDirective = upgradeAdapter.upgradeNg1Component('simple'); 
const Highlight = upgradeAdapter.upgradeNg1Component('highlight');

@Directive({
    selector: '[myHighlight]'
})
export class HighlightDirective {
  @Input('myVar') myVar: string;
  
  constructor(el: ElementRef) {debugger
      el.nativeElement.style.backgroundColor = 'yellow';
      console.log('myVar = '+this.myVar)
      this.myVar = 'world';
      
  }
}

@Component({
    selector: 'my-ng2-component',
    template: '<h1>My First Angular 2 App</h1>' +
      '<simple></simple><div highlight>test</div>' +
      '<div myHighlight>ng2Component</div><div testing></div>'
    ,
    directives: [SimpleDirective, Highlight, HighlightCmp, Testing, HighlightDirective]
})
export class AppComponent {}

angular.module('newApp', ['app'])
  .controller('ctrl', ['$scope', (scope: any) => {
    scope.test = 'hello';
  }])
  .directive('myNg2Component', <any>upgradeAdapter.downgradeNg2Component(AppComponent))
  .directive('myHighlight', <any>downgradeNG2Directive(HighlightDirective));

upgradeAdapter.bootstrap(document.body, ['newApp']);

declare var Reflect: any;
function downgradeNG2Directive(directive: any): Function {
  // Metadata (i.e. selector)
  let metadata = Reflect.getOwnMetadata('annotations', directive)[0];
  if (!metadata) {
    console.log('Error on finding metadata for directive class ' + directive.toString());
    throw new Error();
  }
  
  // add bindings to scope
  let bindings = Reflect.getOwnMetadata('propMetadata', directive);
  let bindingKeys = Object.keys(bindings);
  let scope: any = {};
  bindingKeys.forEach((key) => {
    scope[key] = '=';
  })
  console.log(scope)
  
  // create directive function
  function ng1Directive() {
    return {
      scope: scope,
      link: (scope: any, element: any, attrs: any) => {
        let el: ElementRef = {
          nativeElement: element[0]
        };

        directive.apply(scope, [el]);
      }
    };
  }
  console.log(metadata)
  console.log(directive)
  
  return ng1Directive;
}

