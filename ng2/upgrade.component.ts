import {Component, Directive, ElementRef, Input} from 'angular2/core';
import {UpgradeAdapter} from 'angular2/upgrade';

import {ngAdapter} from 'ngAdapter/build/ngAdapter'; 

function ng1() {
  return {
    scope: {
      fn: '&'
    },
    link: (scope: any, el: Element[], attrs: any) => {
      scope.fn();
    }
  }
}

let module = angular.module('newApp', []);
let adapter = new ngAdapter(module);
  
module.directive('ng1', ng1);

@Component({
    selector: 'my-ng2-component',
    template: '<h1>My First Angular 2 App</h1>' +
      //Change here callMe to CallMeFn to bind this to this component
      '<div ng1 [(fn)]="callMe">ng2Component</div>'
    ,
    directives: [adapter.upgradeNg1Directive('ng1')]
})
export class AppComponent {
  constructor() {
    console.log('AppComponent this');
    console.log(this);
    console.log('---------------------------------------');
  }
  callMe() {
    console.log('callMe this -> should show same instance like AppComponent but is called from another Component')
    console.log(this);
    console.log('---------------------------------------');
  }
  public callMeFn = this.callMe.bind(this);
}

module.directive('myNg2Component', <any>adapter.downgradeNg2Component(AppComponent));

adapter.bootstrap(document.body, ['newApp']);
