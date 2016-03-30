import {Component, Directive, ElementRef, Input} from 'angular2/core';
import {UpgradeAdapter} from 'angular2/upgrade';
import {EventService} from './event.service';

let upgradeAdapter = new UpgradeAdapter();
const SimpleDirective = upgradeAdapter.upgradeNg1Component('simple'); 
const Highlight = upgradeAdapter.upgradeNg1Component('highlight');

@Directive({
    selector: '[myHighlightNG2]',
    providers: [EventService],
    host: {
      '(mousemove)': 'onMouseEnter()',
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
      '<div myHighlightNG2="ng2Highlight">ng2Component</div>'
    ,
    directives: [HighlightDirective]
})
export class AppComponent {}

let module = angular.module('newApp', ['app']);
module.controller('ctrl', ['$scope', (scope: any) => {
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
  
  // initialise provided services
  metadata.providers.forEach((provider: Function) => {
    upgradeAdapter.addProvider(provider);
    module.factory(getFunctionName(provider), 
      upgradeAdapter.downgradeNg2Provider(provider));
  });
  
  // add bindings to scope
  let bindings = Reflect.getOwnMetadata('propMetadata', directive);
  let bindingKeys = Object.keys(bindings);
  let scope: any = {};
  bindingKeys.forEach((key) => {
    scope[key] = '=';
  })
  console.log(scope)
  
  // create directive function
  function ng1Directive($injector: any) {
    return {
      scope: scope,
      link: (scope: any, element: any, attrs: any) => {
        let el: ElementRef = {
          nativeElement: element[0]
        };
        
        // derivate dependencies
        let deps: any[] = [];
        let params: Function[] = Reflect.getMetadata('design:paramtypes', directive);
        params.forEach((dep: Function) => {
          let dependencyName = getFunctionName(dep);
          
          // ElementRef is a special case 
          if (dependencyName === 'ElementRef') {
            deps.push(el);
            return;
          } 
          
          // default case
          let dependency = $injector.get(dependencyName);
          deps.push(dependency);
        });
        
        // combine scope and prototype functions
        let directiveScope = angular.extend({}, scope, directive.prototype);
        directive.apply(directiveScope, deps);
        
        // add hosts binding to element
        let hostKeys = Object.keys(metadata.host);
        hostKeys.forEach((key) => {
          let keyReg = /([A-Z,a-z,0-9]+)/;
          let event = keyReg.exec(key)[0];
          
          let fnReg = /([A-Z,a-z,0-9]+)/;
          let fnName = fnReg.exec(metadata.host[key])[0];
          
          element[0].addEventListener(event, (event: any) => {
            directiveScope[fnName]();
          });
          
        });
      }
    };
  }
  console.log(metadata)
  console.log(directive)
  
  return ng1Directive;
}

function getFunctionName(fn: Function): string {
  let name = fn.toString();
  let reg = /function ([^\(]*)/;
  return reg.exec(name)[1];
}

