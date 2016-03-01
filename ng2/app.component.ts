import {Component} from 'angular2/core';
import {UpgradeAdapter} from 'angular2/upgrade';

let upgradeAdapter = new UpgradeAdapter();
const SimpleDirective = upgradeAdapter.upgradeNg1Component('simple'); 

@Component({
    selector: 'my-ng2-component',
    template: '<h1>My First Angular 2 App</h1>' +
      '<simple></simple>'
    ,
    directives: [SimpleDirective]
})
export class AppComponent {}

angular.module('newApp', ['app'])
  .directive('myNg2Component', <any>upgradeAdapter.downgradeNg2Component(AppComponent));

upgradeAdapter.bootstrap(document.body, ['newApp']);

