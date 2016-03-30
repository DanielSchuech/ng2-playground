import {Component, Directive, ElementRef, Input} from 'angular2/core';
import {UpgradeAdapter} from 'angular2/upgrade';
import {EventService} from './event.service';

let upgradeAdapter = new UpgradeAdapter();
const SimpleDirective = upgradeAdapter.upgradeNg1Component('simple'); 
const Highlight = upgradeAdapter.upgradeNg1Component('highlight');

@Directive({
    selector: '[myHighlight]',
    providers: [EventService]
})
export class HighlightDirective {
  @Input('myVar') myVar: string;
  
  constructor(event: EventService, el: ElementRef) {
      el.nativeElement.style.backgroundColor = 'yellow';
      console.log('myVar = ' + this.myVar)
      this.myVar = 'world';
      
      event.event.subscribe((data: string) => {
        el.nativeElement.textContent = data;
      });
  }
}

@Component({
    selector: 'my-ng2-component',
    template: '<h1>My First Angular 2 App</h1>' +
      '<div myHighlight>ng2Component</div>'
    ,
    directives: [SimpleDirective, Highlight, HighlightDirective]
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
        params.forEach((dep: Function) => {debugger
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
        
        directive.apply(scope, deps);
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

